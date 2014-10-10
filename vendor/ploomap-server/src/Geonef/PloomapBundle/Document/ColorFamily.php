<?php

namespace Geonef\PloomapBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class ColorFamily
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
   * @Doctrine\ODM\MongoDB\Mapping\Collection
   */
  public $colors;

  public function getId()
  {
    return $this->uuid;
  }

  public function getTitle()
  {
    return $this->title;
  }

  public function getColors()
  {
    return $this->colors;
  }

  public function getColorSet($length)
  {
    $sets = $this->getColors();
    if (!count($sets)) {
      throw new \Exception('no color set defined in family: '.$this->uuid);
    }
    foreach ($sets as $set) {
      if (!isset($best) ||
          abs($length - count($set)) < abs($length - count($best))) {
        $best = $set;
      }
    }
    if (count($best) >= $length) {
      return $best = array_slice($best, 0, $length);
    }
    while (count($best) < $length) {
      $best[] = $best[count($best)-1];
    }
    return $best;
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
    if (!count($this->getColors())) {
      $errors['colors'] = 'missing';
      return false;
    }
    return true;
  }

}
