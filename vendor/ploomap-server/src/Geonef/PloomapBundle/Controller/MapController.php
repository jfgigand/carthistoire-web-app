<?php
namespace Geonef\PloomapBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Response;

/**
 * Handle various requests about maps
 *
 * @package Ploomap
 */
class MapController extends Controller
{
  const DOC_PREFIX = 'Geonef\PloomapBundle\Document\\';

  /**
   *
   *
   * @param string $mapRef      value to identify the requested map
   */
  public function csvFeaturesAction($id)
  {
    $map = $this->getMap($id);
    $msMap = $map->build($this->container);
    $msLayer = $msMap->getLayerByName($n=$map->getStatisticsValueLayer());
    $msLayer->open();
    $msLayer->whichShapes($msMap->extent);
    if (!$msLayer) {
      throw new \Exception('layer not defined in mapObj: '.$n);
    }
    while ($msShape = $msLayer->nextShape()) {
      if (!isset($fp)) {
        $fp = fopen('php://temp', 'w+');
        fputcsv($fp, array_keys($msShape->values));
      }
      $values = array_values($msShape->values);
      fputcsv($fp, $values);
    }
    rewind($fp);
    $response = new Response(stream_get_contents($fp));
    fclose($fp);
    $response->headers->set('Content-Type', 'text/csv');
    $response->headers->set('Content-disposition',
                            'attachment; filename=data.csv');
    return $response;
  }

  public function svgAction($id)
  {
    $map = $this->getMap($id);
    $template = $map->svgTemplate;
    if (!$template) {
      throw new \Exception('map has no SVG template defined: '.$id);
    }
    //return new Response('grrr6'.$template->getContent());
    $template->applyTo($this->container, $map);
    $this->container->get('doctrine.odm.mongodb.documentManager')
      ->flush();
    //echo $template->getContent(); echo 'blabla';
    $response = new Response($template->getContent());
    $response->headers->set('Content-Type', $template->getContentType());

    return $response;
  }

  public function sldAction($id, $layer)
  {
    $map = $this->getMap($id);
    $msMap = $map->build($this->container);
    $msLayer = $msMap->getLayerByName($layer);
    $sld = $msLayer->generateSLD();
    $response = new Response($sld);
    $response->headers->set('Content-Type', 'text/xml');

    return $response;
  }

  protected function getMap($id)
  {
    $dm = $this->container->get('doctrine.odm.mongodb.documentManager');
    $class = self::DOC_PREFIX.'Map';
    $map = $dm->find($class, $id);
    if (!$map) {
      throw new \Exception('document not found in class '.$class.': '.$id);
    }
    if (!$map->isPublished()) {
      throw new \Exception("map's publishing is not enabled for ".$id);
    }
    return $map;
  }

}
