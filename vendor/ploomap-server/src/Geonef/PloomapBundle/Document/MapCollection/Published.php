<?php

namespace Geonef\PloomapBundle\Document\MapCollection;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PloomapBundle\Document\MapCollection as AbstractMapCollection;
use Geonef\Ploomap\Util\Geo;

/**
 * Base class for published map collections. Not meant to be instanciated.
 *
 */
class Published extends AbstractMapCollection
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $published;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $comment;

  public function getCategory()
  {
    return $this->category;
  }

  public function isPublished()
  {
    return $this->published;
  }

  public function getComment()
  {
    return $this->comment;
  }

  public function checkProperties(ContainerInterface $container, &$errors)
  {
    $state = parent::checkProperties($container, $errors);
    $state &= $this->checkCond($this->category,
                               'category', 'missing', $errors) &&
      $this->checkCond($this->category->getId(),
                       'category', 'invalid', $errors);
    return $state;
  }
}
