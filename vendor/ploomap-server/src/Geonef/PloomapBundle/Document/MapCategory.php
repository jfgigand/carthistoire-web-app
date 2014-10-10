<?php

namespace Geonef\PloomapBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class MapCategory
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
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $published = false;

  public function getId()
  {
    return $this->uuid;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function isPublished()
  {
    return $this->published;
  }

  public function getMapCollectionCount(ContainerInterface $container)
  {
    $dm = $container->get('doctrine.odm.mongodb.documentManager');
    return $dm->createQueryBuilder
        ('Geonef\PloomapBundle\Document\MapCollection')
      ->field('category.$id')->equals(new \MongoId($this->uuid))
      ->getQuery()->execute()->count();
  }

  /**
   * Fetch published categories from MongoDB and their map collections
   *
   * @param $container ContainerInterface
   * @return array
   */
  public static function getCategories(ContainerInterface $container)
  {
    $dm = $container->get('doctrine.odm.mongodb.documentManager');
    $qCats = $dm
      ->createQueryBuilder(__CLASS__)
      ->field('published')->equals(true)
      ->sort('title', 'asc');
    $cats = $qCats->getQuery()->execute();
    $categories = array();
    foreach ($cats as $cat) {
      $qColls = $dm
        ->createQueryBuilder(__NAMESPACE__ . '\\MapCollection')
        ->field('category.$id')->equals(new \MongoId($cat->getId()))
        ->field('published')->equals(true)
        ->sort('title', 'asc');
      $it = $qColls->getQuery()->execute();
      $colls = array();
      foreach ($it as $coll) {
        $colls[] = array('id' => $coll->getId(),
                         'title' => $coll->getTitle());
      }
      $categories[] =
        array('id' => $cat->getId(),
              'title' => $cat->getTitle(),
              'collections' => $colls);
    }
    return $categories;
  }

}
