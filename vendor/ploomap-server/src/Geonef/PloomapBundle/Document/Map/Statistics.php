<?php

namespace Geonef\PloomapBundle\Document\Map;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PloomapBundle\Document\OgrLayer;
use Geonef\Zig\Util\Number;
use mapObj as MsMap;

/**
 * Base class for statistical maps
 *
 * @Doctrine\ODM\MongoDB\Mapping\Document
 * @Doctrine\ODM\MongoDB\Mapping\HasLifecycleCallbacks
 */
abstract class Statistics extends ModelBased
{
  //////////////////////////////////////////////////////////////////
  // MAPPED PROPERTIES

  /**
   * About the source reference (where the data comes from)
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $source;

  /**
   * Copyright for the data
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $copyright;

  /**
   * Statistics about indicator values
   *
   * Set by self::getIndicatorStatistics() and erased by onUpdate callback.
   * Always use self::getIndicatorStatistics(), not this member.
   *
   * They are stored like :
   *   { layer1: { average: X, ... }, layer2: { ... } }
   *   ("layer1", "layer2" being the data layers)
   *
   * @Doctrine\ODM\MongoDB\Mapping\Hash
   */
  public $indicatorStatistics = array();


  //////////////////////////////////////////////////////////////////
  // NORMAL PROPERTIES

  /**
   * Name of MapScript layer within map to use for indicator value
   *
   * Must be specified by concrete class.
   */
  protected $statisticsValueLayer;

  /**
   * Field name within MapScript layer to use for indicator value
   *
   * Must be specified by concrete class.
   * It is an indexed array of field names
   * (belonging to the layer specified with statisticsValueLayer)
   */
  protected $statisticsValueFields = array();

  /**
   * Used by self::getIndicatorValues() to cache the values
   *
   * Associative array where keys are value field names and values
   * are indexed arrays of float values.
   */
  private $cachedIndicatorValues = null;

  /**
   * If true, do not clear stats at update
   */
  private $indicatorStatisticsUpdated = false;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\PreUpdate
   */
  public function clearStatistics()
  {
    if (!$this->indicatorStatisticsUpdated) {
      $this->indicatorStatistics = null;
    }
    $this->indicatorStatisticsUpdated = false;
  }

  /**
   * Check the validity of a layer and a field existence
   *
   * @see self::checkProperties
   * @param $container
   * @param $errors
   * @param $layer OgrLayer     Layer to check
   * @param $layerProp string   Name of layer property, for error reporting
   * @param $field string       Field name
   * @param $fieldProp string   Name of field property, for error reporting
   * @return boolean
   */
  protected function checkOgrField(ContainerInterface $container,
                                   &$errors, $layer, $layerProp,
                                   $field, $fieldProp) {
    $state = true;
    if (!$layer) {
      $errors[$layerProp] = array('missing');
      $state = false;
    } else {
      $ogrDs = $layer->getOgrDataSource($container);
      if (!$ogrDs) {
        $errors[$layerProp] =
          array('invalid', "La source de données \""
                .$layer->getDataSource()->getName()."\""."n'a pu être ouverte");
        $state = false;
      } else {
        $ogr = $layer->getOgrLayer($container);
        if (!$ogr) {
          $errors[$layerProp] =
            array('invalid', "La source de données \""
                  .$layer->getDataSource()->getName()."\" a pu "
                  ."être ouverte, mais pas la couche \""
                  .$layer->getName()."\"");
          $state = false;
        } else {
          if (!$field) {
            $errors[$fieldProp] = array('missing');
            $state = false;
          } else {
            $defn = $ogr->getLayerDefn();
            $idx = $defn->getFieldIndex($field);
            if ($idx < 0) {
              $errors[$fieldProp] =
                array('invalid', "Champ \"".$field ."\" "
                      ."inexistant dans "."la couche \"".$layer->getName()
                      ."\" [".$layerProp."] (code ".$idx.")");
              $state = false;
            } else {
              $fieldDef = $defn->getFieldDefn($idx);
              $name = $fieldDef->GetNameRef();
              if ($name !== $field) {
                $errors[$fieldProp] =
                  array('invalid', "Champ \"".$field ."\" "
                        ."mal nommé pour la couche \"".$layer->getName()
                        ."\" [".$layerProp."] : vérifier la casse ! "
                        ."(\"".$name."\", plutôt ?)");
                $state = false;
              }
            }
          }
        }
      }
    }
    return $state;
  }

  /**
   * Check that layers belong to the same datasource
   *
   * @see self::checkProperties
   * @param $container
   * @param $errors
   * @param $ogrLayers array Array of OgrLayer
   * @param $ogrLayersProps array Array of layer property names (keys must match $ogrLayers')
   * @return boolean
   */
  protected function checkSameOgrDataSource(ContainerInterface $container,
                                            &$errors, $ogrLayers,
                                            $ogrLayersProps) {
    $msg = "Doivent appartenir à la même source de données : "
      . '['.implode('], [', $ogrLayersProps).']';
    $state = true;
    foreach ($ogrLayers as $k => $ogrLayer) {
      if ($ogrLayer && (($dataSource = $ogrLayer->getDataSource($container)))) {
        if (isset($commonDataSource)) {
          if ($commonDataSource->getId() !== $dataSource->getId()) {
            $errors[$ogrLayersProps[$k]] = array('invalid', $msg);
            $state = false;
          }
        } else {
          $commonDataSource = $dataSource;
        }
      }
    }
    return $state;
  }

  public function getLegendData(ContainerInterface $container)
  {
    $statistics = $this->getIndicatorStatistics($container);
    $data = parent::getLegendData($container);
    //$data['value']['average'] = $statistics['average'];
    $data['value']['hasNull'] = $statistics['nullCount'] > 0;
    return $data;
  }

  protected function addOwnLayers(MsMap $msMap,
                                  ContainerInterface $container)
  {
    $this->buildStatisticLayers($msMap, $container);
  }

  protected function buildStatisticLayers(MsMap $msMap,
                                          ContainerInterface $container)
  {
    throw new \Exception('must be implemented in concrete class');
  }

  public function getStatisticsValueLayer()
  {
    return $this->statisticsValueLayer;
  }

  public function getIndicatorValues(ContainerInterface $container,
                                     $field = null,
                                     $includeNull = false)
  {
    if (!$this->cachedIndicatorValues) {
      $this->cachedIndicatorValues = array();
    }
    if (!$field) {
      $field = $this->statisticsValueFields[0];
    }
    if (!isset($this->cachedIndicatorValues[$field])) {
      $msMap = $this->build($container);
      $msLayer = @$msMap->getLayerByName($this->statisticsValueLayer);
      if (!$msLayer) {
        throw new \Exception('layer not defined in mapObj: '
                             . $this->statisticsValueLayer);
      }
      $msLayer->open();
      $msLayer->whichShapes($msMap->extent);
      $values = array();
      while ($msShape = $msLayer->nextShape()) {
        $values[] = $msShape->values[$field];
      }
      $msLayer->close();
      $this->cachedIndicatorValues[$field] = $values;
    }
    $values = $this->cachedIndicatorValues[$field];
    if (!$includeNull) {
      Number::removeNullsFromList($values);
    }
    return $values;
  }

  /**
   * Retrieve statistics info for given data layer
   *
   * @param $container
   * @param $layerName string  name of layer to retrieve the stats from.
   *                           NULL assumes $this->statisticsValueLayer
   * @return array Associative array, like { average: X, ... }
   */
  public function getIndicatorStatistics(ContainerInterface $container,
                                         $field = null)
  {
    if (!$this->indicatorStatistics) {
      $this->indicatorStatistics = array();
    }
    if (!$field) {
      $field = $this->statisticsValueFields[0];
    }
    //$container->get('logger')->debug('OKA '.$field);
    if (!isset($this->indicatorStatistics[$field])) {
      $values = $this->getIndicatorValues($container, $field, true);
      $this->indicatorStatistics[$field] =  Number::getListStatistics($values);
      $this->indicatorStatisticsUpdated = true;
      $dm = $container->get('doctrine.odm.mongodb.documentManager');
      $dm->persist($this);
    }
    return $this->indicatorStatistics[$field];
  }

  /**
   * Return multiple discretisations, through different methods
   *
   * @return array like: array('equalQuantile' => array(1.2, 2.2), ...)
   */
  /* public function getIndicatorDiscretisations(ContainerInterface $container) */
  /* { */
  /*   $stats = $this->getIndicatorStatistics($container); */

  /* } */

}
