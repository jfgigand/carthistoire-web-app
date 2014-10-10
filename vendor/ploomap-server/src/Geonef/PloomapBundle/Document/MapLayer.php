<?php

namespace Geonef\PloomapBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Base class for map layer documents
 *
 * @Doctrine\ODM\MongoDB\Mapping\EmbeddedDocument
 * @ Doctrine\ODM\MongoDB\Mapping\InheritanceType("SINGLE_COLLECTION")
 * @ Doctrine\ODM\MongoDB\Mapping\DiscriminatorField(fieldName = "module")
 * @ Doctrine\ODM\MongoDB\Mapping\DiscriminatorMap({
 *      "abstract" = "Geonef\PloomapBundle\Document\MapLayer",
 *      "MapFile" = "Geonef\PloomapBundle\Document\MapLayer\MapFile",
 *      "StaticLayer" = "Geonef\PloomapBundle\Document\MapLayer\StaticLayer",
 *      "OgrVector" = "Geonef\PloomapBundle\Document\MapLayer\OgrVector"
 *  })
 */
class MapLayer
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $visible;

  /**
   * Check validity of document properties
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

  protected function doBuild(\mapObj $msMap, ContainerInterface $container)
  {
    throw new \Exception('must be implemented on concrete class');
  }

  public function build(\mapObj $msMap, ContainerInterface $container)
  {
    return $this->doBuild($msMap, $container);
  }

  protected function getName()
  {
    throw new \Exception('to be overloaded');
  }

  protected function configureMsLayer(\layerObj $msLayer, ContainerInterface $container)
  {
    $msLayer->set('name', $this->getName());
    $msLayer->setMetaData('wms_title', $this->getName());
    $msLayer->set('status', $this->visible ? MS_ON : MS_OFF);
  }

}
