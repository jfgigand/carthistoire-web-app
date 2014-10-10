<?php

namespace Geonef\PloomapBundle\Document;

use Geonef\PloomapBundle\Document\Map\MapInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\Zig\Util\FileSystem;
use Geonef\Zig\Util\String;
use Geonef\Ploomap\Util\Geo;
use OGRCoordinateTransformation;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 * @Doctrine\ODM\MongoDB\Mapping\HasLifecycleCallbacks
 * @Doctrine\ODM\MongoDB\Mapping\InheritanceType("SINGLE_COLLECTION")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorField(fieldName = "module")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorMap({
 *   "LayerList"  = "Geonef\PloomapBundle\Document\Map\LayerList",
 *   "Stock"      = "Geonef\PloomapBundle\Document\Map\Stock",
 *   "Ratio"      = "Geonef\PloomapBundle\Document\Map\Ratio",
 *   "StockRatio" = "Geonef\PloomapBundle\Document\Map\StockRatio",
 *   "RatioDisc"  = "Geonef\PloomapBundle\Document\Map\RatioDisc",
 *   "Cartogram"  = "Geonef\PloomapBundle\Document\Map\Cartogram",
 *   "RatioGrid"  = "Geonef\PloomapBundle\Document\Map\RatioGrid",
 *   "Potential"  = "Geonef\PloomapBundle\Document\Map\Potential"
 *  })
 *
 *   "MapFile"    = "Geonef\PloomapBundle\Document\Map\MapFile",
 *   "HardMap"    = "Geonef\PloomapBundle\Document\Map\HardMap",
 *
 */
abstract class Map implements MapInterface
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $name;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument = "Geonef\PloomapBundle\Document\MapCollection")
   */
  public $mapCollection;

  /**
   * Scale level (ie. nuts0, nuts1, c100 ...)
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $level;

  /**
   * Map title
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $title;

  /**
   * Map legend title
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  //public $legendTitle;

  /**
   * Map short title
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  //public $shortTitle;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  //public $module;


  /**
   * @Doctrine\ODM\MongoDB\Mapping\Collection
   */
  public $extent;

  /**
   * User notes
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $userNotes;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $published = false;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument = "Geonef\ZigBundle\Document\Template")
   */
  public $svgTemplate;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Hash
   */
  public $propValidity = array();

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Date
   */
  public $lastEditedAt;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Hash
   */
  //public $services = array();

  /**
   * MapServer MAP string cache
   *
   * Cleared at prePersist
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $msMapString;

  /**
   * MapServer MAP file path
   *
   * For direct use by MapServer CGI.
   * Cleared at prePersist.
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $msMapPath;

  protected $justBuilt = false;

  public function __construct()
  {
    $this->lastEditedAt = new \DateTime();
  }

  public function getId()
  {
    return $this->uuid;
  }

  public function getName()
  {
    return $this->title;
  }

  public function isPublished()
  {
    return $this->published;
  }

  /**
   * @Doctrine\ODM\MongoDB\Mapping\PreUpdate
   */
  public function preUpdate()
  {
    if (!$this->name) {
      $this->name = $this->getName();
    }
    if (!$this->justBuilt) {
      //$container->get('logger')->debug('oka !! not just build, clearing');
      $this->clearBuild();
    }
  }

  /**
   * Clear any cache data
   *
   * Especially: MapFile string property & file
   */
  public function clearBuild($container = null)
  {
    if (strlen($this->msMapPath)) {
      $path = $this->msMapPath;
    } else if ($container) {
      $path = $this->getRelPath($container, 'mapFile', 'map');
    }
    if (isset($path) && file_exists($path)) {
      unlink($path);
    }
    $this->msMapPath = null;
    $this->msMapString = null;
  }

  /**
   * @Doctrine\ODM\MongoDB\Mapping\PostUpdate
   */
  public function postUpdate()
  {
    $this->justBuilt = false;
  }

  public function setExtent($extent)
  {
    if (is_array($extent) || is_object($extent)) {
      $this->extent = $extent;
    } else {
      $this->extent = array(0, 0, 0, 0);
    }
  }

  public function getPropValidity(ContainerInterface $container)
  {
    if (!isset($this->propValidity['valid'])) {
      $this->updatePropValidity($container);
    }
    return $this->propValidity;
  }

  public function updatePropValidity(ContainerInterface $container)
  {
    $errors = array();
    $isValid = $this->checkProperties($container, $errors);
    $this->propValidity = array('valid' => $isValid, 'errors' => $errors);
    if (!$isValid && $this->published) {
      $this->published = false;
    }
    return $isValid;
  }

  /**
   * Check validity of this map properties
   *
   * This tests properties values as well as whether all checks
   * whose success garanties a build success
   * (ex: datasource as valid, can be opened...)
   *
   * @param $container ContainerInterface
   * @param $errors    array
   * @return boolean    Whether the map properties are valid
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    return true;
  }

  /**
   * Facility for checkProperties()
   *
   * @param $cond boolean
   * @param $prop string
   * @param $msg string
   * @param $errors array
   */
  protected function checkCond($cond, $prop, $msg, &$errors)
  {
    if (!$cond) {
      $errors[$prop] = $msg;
      return false;
    }
    return true;
  }

  protected function checkColor($color, $prop, &$errors)
  {
    if (!$color && !strlen($color)) {
      $errors[$prop] = 'missing';
      return false;
    }
    if (!preg_match('/#[0-9a-fA-F]{6}/', $color)) {
      $errors[$prop] = 'invalid';
      return false;
    }
    return true;
  }

  /**
   * Build MapScript map object for this map document
   *
   * The 'msMapString' property is used if set, otherwise,
   * the prop is set and this doc is automatically persisted,
   * but not flushed.
   *
   * @param $container ContainerInterface
   * @return \msmap_obj
   */
  public function build(ContainerInterface $container)
  {
    $v = $this->getPropValidity($container);
    if (!$v['valid']) {
      throw new \Exception('properties are not valid!');
    }
    $msMap = true;
    if (strlen($this->msMapString) > 0) {
      /* $mt = microtime(true); */
      //try {
        $msMap = @ms_newMapObjFromString($this->msMapString);
        //}
        //catch(\Exception $e) {
        //}
    }
    if (!is_object($msMap)) {
      $msMap = $this->doBuild($container);
      $this->postBuild($msMap, $container);
      $this->msMapString = $this->getMapString($container, $msMap);
      $this->justBuilt = true;
      $dm = $container->get('doctrine.odm.mongodb.documentManager');
      $dm->persist($this);
      $container->get('logger')->info('ploomap: map '.$this->getId()
                                      .' built, mapfile persisted');
    }
    if (!strlen($this->msMapPath) || !file_exists($this->msMapPath)) {
      $this->msMapPath = $this->getRelPath($container, 'mapFile', 'map');
      file_put_contents($this->msMapPath, $this->msMapString);
    }
    return $msMap;
  }

  /**
   * Kind of abstract method - build the MapScript map object
   *
   * Usually, the method will call static::configureMap() at some point.
   */
  protected function doBuild(ContainerInterface $container)
  {
    throw new \Exception('must be implemented on concrete class');
  }

  /**
   * Return legend data for this map
   *
   * @param $container ContainerInterface
   * @return string
   */
  public function getLegendData(ContainerInterface $container)
  {
    return array('value' => array());
  }

  /**
   * Build SVG for this map
   *
   * @param $container ContainerInterface
   * @param $format string (ex: 'html' or 'svg')
   * @param $resolution float
   * @return string
   */
  public function buildSvg(ContainerInterface $container)
  {
    throw new \Exception('no legend is available for this map: '.$this->uuid);
  }

  /**
   * Configure maps
   *
   * Called by children classes whenever needed
   */
  protected function configureMap(\mapObj $msMap,
                                  ContainerInterface $container)
  {
    if (Geo::isExtentValid($this->extent)) {
      list($x0, $y0, $x1, $y1) =
        array_map('floatval', $this->extent);
      $msMap->setExtent($x0, $y0, $x1, $y1);
    }
  }

  protected function postBuild(\mapObj $msMap,
                               ContainerInterface $container)
  {
    $name = strtr(String::removeAccents($this->getName()),
                  ' ?,;:!?./*','__________');//$msMap->name;
    $class = get_class($this);
    $name = 'map_' .strtolower(substr($class, strrpos($class, '\\')+1))
      . '_'.$this->getId();
    $msMap->set('name', $name);
    $msMap->setConfigOption('MS_ERRORFILE', $this->getRelPath($container, 'mapLog', 'log', true));
    //$msMap->setConfigOption('CPL_DEBUG', 'ON');
    //$msMap->setConfigOption('PROJ_DEBUG', 'ON');
    //$msMap->set('debug', 3);
    if (!Geo::isExtentValid(Geo::msRectToExtent($msMap->extent))) {
      // if extent is invalid or not defined, so compute it
      Geo::extentToMsRect($this->computeExtent($container, $msMap),
                          $msMap->extent);
    }
    $imagePath = $this->getRelPath($container, 'public/mapImage', null);
    $msMap->web->set('imagepath', $imagePath);
    $msMap->web->set('imageurl', '/mapImage');
    $msMap->web->set('temppath', $this->getRelPath($container, 'mapTemp', null));
    $url = $container->get('router')->generate
      ('geonefPloomapOwsDefault', array('mapRef' => $this->uuid), true).'?';
    $srs = $msMap->getProjection();
    $srs = strtoupper(str_replace('+init=', '', $srs));
    $srs .= ' EPSG:4326 EPSG:900913';
    $props = array('onlineresource' => $url,
                   'ows_updatesequence' => time(),
                   'ows_enable_request' => '*',
                   'wms_onlineresource' => $url,
                   'wms_srs' => $srs,
                   'wms_title' => $this->title,
                   //'wms_feature_info_mime_type' => 'text/csv',
                   'wfs_onlineresource' => $url,
                   'wfs_srs' => $srs,
                   'wfs_title' => $this->title,
                   'wfs_abstract' => $this->title
                   );
    foreach ($props as $p => $n) {
      $msMap->setMetaData($p, $n);
      //$msMap->web->metadata->set($p, $n);
    }
    for ($i = 0; $i < $msMap->numlayers; ++$i) {
      $msLayer = $msMap->getLayer($i);
      $n = $msLayer->name;
      $msLayer->set('name', strtr(String::removeAccents($n),' ','_'));
      $msLayer->metadata->set('wms_title', $n);
      $msLayer->metadata->set('wfs_title', $n);
      $msLayer->metadata->set('gml_include_items', 'all');
      $msLayer->metadata->set('gml_geometries', 'geom');
      $msLayer->metadata->set('gml_geom_type', 'multipolygon');
      $msLayer->metadata->set('gml_types', 'auto');
      $msLayer->metadata->set('wfs_getfeature_formatlist', 'csv,csvzip,shapezip,kml,kmz');
      $msLayer->set('dump', 1);
      $msLayer->set('template', '/tmp/nothing');
    }
  }

  public function getMapString(ContainerInterface $container,
                               \mapObj $msMap = null)
  {
    if (!$msMap) {
      $msMap = $this->build($container);
    }
    $path = tempnam(sys_get_temp_dir(), 'map_');
    $msMap->save($path);
    $string = file_get_contents($path);
    unlink($path);
    return $string;
  }

  public function getRelPath(ContainerInterface $container, $dir, $ext, $createFile = false)
  {
    $absDir = FileSystem::makePath
      ($container->getParameter('kernel.cache_dir'), $dir);
    $path = !$ext ? $absDir :
      FileSystem::makePath($absDir, $this->getId().'.'.$ext);
    if (!is_dir($absDir)) {
      mkdir($absDir);
    }
    if (!file_exists($path)) {
      touch($path);
    }
    return $path;
  }

  /* public function getExtent(ContainerInterface $container) */
  /* { */
  /*   if (Geo::isExtentValid($this->extent)) { */
  /*     return $this->extent; */
  /*   } */
  /*   return $this->computeExtent($container); */
  /* } */

  public function computeExtent(ContainerInterface $container,
                                \mapObj $msMap = null)
  {
    if (!$msMap) {
      $savedExtent = $this->extent;
      $this->extent = null;
      $msMap = $this->build($container);
      $this->extent = $savedExtent;
    }
    $mapProj = $msMap->getProjection();
    $extent = array(null, null, null, null);
    for ($i = 0, $count = $msMap->numlayers; $i < $count; ++$i) {
      $msLayer = $msMap->getLayer($i);
      if ($msLayer->status == MS_ON) {
        $layerExtent = Geo::msRectToExtent($msLayer->getExtent());
        $proj = $msLayer->getProjection();
        if ($proj !== $mapProj) {
          $container->get('logger')->debug
            ('OKA layer '.$msLayer->name.' has diff proj "'.$proj
             .'" than map\'s ('.$mapProj.'"): reprojecting');
          if (!isset($mapSpatialRef)) {
            $mapSpatialRef = Geo::parseSpatialRef($mapProj);
          }
          $reproject = new OGRCoordinateTransformation
            (Geo::parseSpatialRef($proj), $mapSpatialRef);
          $x = array($layerExtent[0], $layerExtent[2]);
          $y = array($layerExtent[1], $layerExtent[3]);
          if (!$reproject->Transform($x, $y)) {
            throw new \Exception('failed to reproject!');
          }
          $layerExtent = array($x[0], $y[0], $x[1], $y[1]);
        }
        $extent = Geo::totalExtent($extent, $layerExtent);
      }
    }
    if (!$count) {
      throw new \Exception('no layer defined for map: '.$this->uuid);
    }

    return $extent;
  }

  public function getLayerNames(ContainerInterface $container,
                                \mapObj $msMap = null, $onlyVisible = false)
  {
    if (!$msMap) {
      $msMap = $this->build($container);
    }
    $layers = array();
    $order = $msMap->getLayersDrawingOrder();
    foreach ($order as $idx) {
      $msLayer = $msMap->getLayer($idx);
      if (!$onlyVisible || $msLayer->status == MS_ON) {
        $layers[] = $msLayer->name;
      }
    }
    return $layers;
  }

  public function getWmsMapUrl(ContainerInterface $container,
                                  $params = array())
  {
    $p['SERVICE'] = 'WMS';
    $p['VERSION'] = '1.1.1';
    $p['REQUEST'] = 'GetMap';
    $p['EXCEPTIONS'] = 'application/vnd.ogc.se_inimage';
    $p['FORMAT'] = 'image/png';
    $msMap = $this->build($container);
    if (!isset($params['BBOX'])) {
      $p['BBOX'] = implode(',', Geo::msRectToExtent($msMap->extent));
    }
    if (!isset($params['LAYERS'])) {
      $layers = $this->getlayerNames($container, $msMap, true);
      $p['LAYERS'] = implode(',', $layers);
    }
    if (!isset($params['SRS'])) {
      $srs = $msMap->getProjection();
      $p['SRS'] = strtoupper(str_replace('+init=', '', $srs));
    }
    $params = array_merge($p, $params);
    $url = $msMap->getMetaData('wms_onlineresource');
    foreach ($params as $key => $val) {
      $url .= $key . '=' . urlencode($val) . '&';
    }
    return $url;
  }

  public function getWfsUrl(ContainerInterface $container,
                                  $params = array())
  {
    $p['SERVICE'] = 'WFS';
    $p['VERSION'] = '1.0.0';
    $p['REQUEST'] = 'GetFeature';
    //$p['FORMAT'] = 'image/png';
    $msMap = $this->build($container);
    if (!isset($params['TYPENAME'])) {
      $layers = $this->getlayerNames($container, $msMap, true);
      $p['TYPENAME'] = implode(',', $layers);
    }
    $params = array_merge($p, $params);
    $url = $msMap->getMetaData('wfs_onlineresource');
    foreach ($params as $key => $val) {
      $url .= $key . '=' . urlencode($val) . '&';
    }
    return $url;
  }
}
