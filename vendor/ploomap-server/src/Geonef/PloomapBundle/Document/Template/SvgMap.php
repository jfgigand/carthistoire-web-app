<?php

namespace Geonef\PloomapBundle\Document\Template;

use Geonef\ZigBundle\Document\Template\Text;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PloomapBundle\Document\Map;
use Geonef\Zig\Registry\Mapper;
use Geonef\Zig\Util\Dom;
use DOMDocument;
use DOMElement;
use DOMXPath;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class SvgMap extends Text
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $mapElementId = 'map';

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $legendElementId = 'legend';

  /**
   * @inheritsDoc
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    $state = parent::checkProperties($container, $errors);
    if ($state) {
      try {
        $svgDoc = Dom::loadXmlString($this->content);
      }
      catch (\Exception $e) {
        $state &= $this->checkCond(false, 'content',
                                   array('invalid', "Le texte n'est pas du "
                                         ."XML valide: ".$e->getDescription()),
                                   $errors);
      }
      if ($state) {
        foreach (array('mapElementId', 'legendElementId') as $prop) {
          if (!$this->$prop) { continue; }
          try {
            $node = $this->getElementById($svgDoc, $this->$prop);
            foreach (array('x', 'y', 'width', 'height') as $k) {
              $state &= $this->checkCond($node->getAttribute($k) > 0, $prop,
                                         array('invalid', "L'élément (ID '".$this->$prop
                                               ."') n'a pas l'attribut '".$k
                                               ."' (rectangle conseillé)."),
                                         $errors);
            }
          }
          catch (\Exception $e) {
            $state &= $this->checkCond(false, $prop,
                                       array('invalid', "L'ID fournit ('".$this->$prop
                                             ."') n'a pas été trouvé dans le document."),
                                       $errors);
          }
        }
        $state &= $this->checkCond($this->mapElementId &&
                                   $this->mapElementId != $this->legendElementId,
                                   'legendElementId',
                                   array('invalid', "La légende et la carte ne "
                                         ."peuvent partager le même ID."),
                                   $errors);
      }
    }
    $state &= $this->checkCond(strlen($this->mapElementId) > 0, 'mapElementId',
                               array('invalid', "L'ID de l'élément <rect> est obligatoire "
                                     ."pour l'insertion de la carte dans le template."),
                               $errors);

    return $state;
  }

  /**
   * @inheritsDoc
   */
  public function getSupportedClasses()
  {
    return array('Map');
  }

  /**
   * @inheritsDoc
   */
  protected function doApply(ContainerInterface $container, /*Map*/ $map)
  {
    $templateTxt = parent::doApply($container, $map);
    $templateSvg = $this->getTemplateSvg($templateTxt, $map);
    $rectNode = $this->getElementById($templateSvg, $this->mapElementId);
    $mapSvg = $this->getMapSvg($container, $map, $rectNode);
    $this->integrateMapInTemplate($templateSvg, $rectNode, $mapSvg);
    if ($this->legendElementId) {
      $this->buildLegend($container, $templateSvg, $map);
    }
    $serializedSvg = $templateSvg->saveXML();
    //$serializedSvg = $mapSvg->saveXML();
    $this->applyContentType = 'image/svg+xml';
    return $serializedSvg;
  }

  protected function getMapSvg(ContainerInterface $container, Map $map,
                               DOMElement $rectNode)
  {
    $msMap = $map->build($container);
    $msMap->setSize($rectNode->getAttribute('width'),
                    $rectNode->getAttribute('height'));
    $msMap->selectOutputFormat('image/svg+xml');
    $msImage = $msMap->draw();
    //var_dump($msImage);
    //$svg = 'w= '.$msImage->width.' h='.$msImage->height.' res='.$msImage->resolution
    //.' resF='.$msImage->resolutionfactor;//
    //ob_start();
    //ms_ioInstallStdoutToBuffer();
    $file = tempnam('/tmp', uniqid());
    $status = $msImage->saveImage($file, $msMap);
    if ($status !== MS_SUCCESS) {
      throw new \Exception('could not save image in: '.$file);
    }
    //ms_ioResetHandlers();
    $svg = Dom::loadXmlFile($file);
    //$svg = file_get_contents($file);
    unlink($file);

    return $svg;
  }

  protected function getTemplateSvg($templateTxt, Map $map)
  {
    $templateSvg = Dom::loadXmlString($templateTxt);
    $class = end(explode('\\', get_class($map)));
    $templateSvg->documentElement->setAttribute('class', 'type'.$class);

    return $templateSvg;
  }

  protected function integrateMapInTemplate(DOMDocument $templateSvg,
                                            DOMElement $rectNode,
                                            DOMDocument $mapSvg)
  {
    foreach (array('x', 'y', 'width', 'height') as $k) {
      $$k = $rectNode->getAttribute($k);
    }
    $mapNode = $templateSvg->importNode($mapSvg->documentElement, true);
    $mapNode->setAttribute('width', $width);
    $mapNode->setAttribute('height', $height);
    $gNode = $templateSvg->createElementNS('http://www.w3.org/2000/svg', 'g');
    $gNode = $templateSvg->createElement('g');
    $gNode->setAttribute('transform', 'translate('.$x.','.$y.')');
    $gNode->appendChild($mapNode);
    $rectNode->parentNode->replaceChild($gNode, $rectNode);

    //$rectNode = $this->getElementById($templateSvg, $this->mapElementId);
    //$gNode->appendChild($mapNode);
  }

  protected function buildLegend(ContainerInterface $container,
                                  DOMDocument $templateSvg, Map $map)
  {
    $data = $map->getLegendData($container);
    $props = array_merge(array('class' => 'Geonef\\Ploomap\\View\\SvgMapLegend\\'
                               .end(explode('.', $data['widgetClass']))),
                         $data['value']);
    $view = Mapper::mapObject($props);
    $legendSvg = $view->build();
    $doc = Dom::loadXmlString($legendSvg);
    $rectNode = $this->getElementById($templateSvg, $this->legendElementId);
    foreach (array('x', 'y', 'width', 'height') as $k) {
      $$k = $rectNode->getAttribute($k);
    }
    $legendNode = $templateSvg->importNode($doc->documentElement, true);
    $gNode = $templateSvg->createElementNS('http://www.w3.org/2000/svg', 'g');
    $gNode = $templateSvg->createElement('g');
    $gNode->setAttribute('transform', 'translate('.$x.','.$y.')');
    $gNode->appendChild($legendNode);
    $rectNode->parentNode->replaceChild($gNode, $rectNode);
  }

  protected function getElementById(DOMDocument $doc, $id)
  {
    $xp = new DOMXPath($doc);
    $nl = $xp->query("//*[@id='".$id."']");
    if (!$nl->length) {
      throw new \Exception("ID not found in doc: ".$id);
    }
    return $nl->item(0);
  }
}
