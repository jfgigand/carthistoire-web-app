<?php

namespace Geonef\PloomapBundle\Document\Map;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PloomapBundle\Document\GdalDataset;
use Doctrine\ODM\MongoDB\DocumentManager;
use Geonef\Ploomap\Util\Geo;
use mapObj as MsMap;
use layerObj as MsLayer;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class Potential extends Statistics
{
  const MODULE = 'Potential';

  /**
   * Legend title for ratios
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $potentialLegendTitle;

  /**
   * Unit for ratios
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $potentialUnit;

  /**
   * Raster layer
   *
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\PloomapBundle\Document\GdalDataset")
   */
  public $gdalDataset;

  /**
   * Class bounds for aggregation (excluding min & max)
   *
   * @Doctrine\ODM\MongoDB\Mapping\Collection
   */
  public $classBounds;

  /**
   * Color family to use
   *
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\PloomapBundle\Document\ColorFamily")
   */
  public $colorFamily;

  /**
   * @inheritsDoc
   */
  protected $statisticsValueLayer = 'potential';

  /**
   * @inheritsDoc
   */
  protected $statisticsValueFields = array('ratio');

  /**
   * @inheritDoc
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    $state = parent::checkProperties($container, $errors);
    // class bounds & colors
    $s = is_array($this->classBounds) && count($this->classBounds) > 0;
    if ($s) {
      foreach ($this->classBounds as $val) {
        if (!is_numeric($val)) {
          $s = false;
          break;
        }
      }
    }
    $state &= $this->checkCond($s, 'classBounds',
                               array('invalid', "Doit être une liste de réels "
                                     ."séparés par des virgules"), $errors);
    $errs = array();
    $state &= $this->checkCond($this->colorFamily,
                               'colorFamily', 'missing', $errors) &&
      $this->checkCond($this->colorFamily->checkProperties($container, $errs),
                       'colorFamily', 'invalid', $errors);
    return $state;
  }

  public function getIndicatorValues(ContainerInterface $container,
                                     $field = null,
                                     $includeNull = false)
  {
    throw new \Exception("statistics not supported (yet!) on raster layers");
  }

  public function getLegendData(ContainerInterface $container)
  {
    /* $stats = $this->getIndicatorStatistics($container); */
    $classes = array();
    $count = count($this->classBounds);
    $classColors = $this->colorFamily->getColorSet($count + 1);
    for ($i = -1; $i < $count; ++$i) {
      $classes[$i + 1]['color'] = $classColors[$i + 1];
      $classes[$i + 1]['minimum'] = $i >= 0 ?
        $this->classBounds[$i] : null /*$stats['minimum']*/;
    }
    /* $data = parent::getLegendData($container); */
    /* $data = array(); */
    /* $data['widgetClass'] = 'geonef.ploomap.legend.Intervals'; */
    /* $data['value']['classes'] = array */
    /*   ('title' => $this->potentialLegendTitle, */
    /*    'unit' => $this->potentialUnit, */
    /*    'average' => $stats['average'], */
    /*    'maximum' => $stats['maximum'], */
    /*    'intervals' => $classes, */
    /*    'polygonOutlineColor' => '#A0A0A0'/\*$this->polygonOutlineColor*\/); */

    $data = array();
    $data['widgetClass'] = 'geonef.ploomap.legend.Intervals';
    $data['value']['classes'] = array
      ('title' => $this->potentialLegendTitle,
       'unit' => $this->potentialUnit,
       'average' => null,
       'maximum' => null,
       'intervals' => $classes,
       'polygonOutlineColor' => '#A0A0A0'/*$this->polygonOutlineColor*/);

    return $data;
  }

  protected function buildStatisticLayers(MsMap $msMap,
                                          ContainerInterface $container)
  {
    $msPotentialLayer = ms_newLayerObj($msMap);
    $this->configurePotentialLayer($msPotentialLayer, $msMap, $container);
    $this->configurePotentialStyle($msPotentialLayer, $msMap, $container);
  }

  protected function configurePotentialLayer(MsLayer $msLayer,
                                             MsMap $msMap,
                                             ContainerInterface $container)
  {
    $msLayer->set('name', 'potential');
    $msLayer->set('type', MS_LAYER_RASTER);
    //Geo::setLayerConnection($container, $msLayer, $this->polygonOgrLayer,
    //                        self::FORCE_OGR_CONNECTION);
    $msLayer->set('data', $this->getConnectionData
                  ($this->gdalDataset, $msMap, $msLayer, $container));
    $msLayer->setProjection($msMap->getProjection());
    $msLayer->set('status', MS_ON);
  }

  protected function configurePotentialStyle(MsLayer $msLayer,
                                           MsMap $msMap,
                                           ContainerInterface $container)
  {
    // interval classes
    $count = count($this->classBounds);
    $classColors = $this->colorFamily->getColorSet($count + 1);
    for ($i = -1; $i < $count; ++$i) {
      $conds = array();
      if ($i >= 0) {
        $conds[] = '[pixel] >= '.$this->classBounds[$i].'';
      }
      if ($i + 1 < $count) {
        $conds[] = '[pixel] < '.$this->classBounds[$i + 1].'';
      }
      $msClass = ms_newClassObj($msLayer);
      $msClass->setExpression('('.implode(' AND ', $conds).')');
      $msStyle = ms_newStyleObj($msClass);
      Geo::setMsColor($msStyle->color, $classColors[$i + 1]);
    }
  }

  protected function getConnectionData(GdalDataset $gdalDs,
                                       MsMap $msMap,
                                       MsLayer $msLayer,
                                       ContainerInterface $container)
  {
    return $gdalDs->getSourcePath($container);
  }

}
