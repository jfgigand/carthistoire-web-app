<?php

namespace Geonef\PloomapBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 * @Doctrine\ODM\MongoDB\Mapping\InheritanceType("SINGLE_COLLECTION")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorField(fieldName = "module")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorMap({
 *   "MultiRepr"      = "Geonef\PloomapBundle\Document\MapCollection\MultiRepr",
 *   "SingleRepr"     = "Geonef\PloomapBundle\Document\MapCollection\SingleRepr",
 *   "FreeCollection" = "Geonef\PloomapBundle\Document\MapCollection\FreeCollection"
 *  })
 */
abstract class MapCollection
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $title;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $userNotes;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\PloomapBundle\Document\MapCategory")
   * @Doctrine\ODM\MongoDB\Mapping\Index
   */
  public $category;

  public function getId()
  {
    return $this->uuid;
  }

  public function getTitle()
  {
    return $this->title;
  }

  /**
   * (overloaded by MapCollection\Published)
   *
   * @return boolean whether it can be published
   */
  public function isPublished()
  {
    return false;
  }

  public function getMaps(ContainerInterface $container)
  {
    $dm = $container->get('doctrine.odm.mongodb.documentManager');
    return $dm->createQueryBuilder
        ('Geonef\PloomapBundle\Document\Map')
      ->field('mapCollection.$id')->equals(new \MongoId($this->uuid))
      ->getQuery()->execute();
  }

  public function getMapCount(ContainerInterface $container)
  {
    return $this->getMaps($container)->count();
  }

  /**
   * Check validity of document properties
   *
   * @param $container ContainerInterface
   * @param $errors    array
   * @return boolean    Whether the map properties are valid
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    return $this->checkCond(strlen(trim($this->title)),
                            'title', 'missing', $errors);
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

}
