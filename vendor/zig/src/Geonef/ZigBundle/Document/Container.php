<?php

namespace Geonef\ZigBundle\Document;

//use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 *
 *
 * @Document(collection="containers")
 */
class Container
{
  /**
   * @ReferenceOne(targetDocument="Container")
   */
  public $inherited;

  /**
   * @Hash
   */
  public $parameters;

  /**
   * Merge ascendant parameters with this', like OOP inheritance
   */
  public function mergeInherited()
  {
  }

  //public
}
