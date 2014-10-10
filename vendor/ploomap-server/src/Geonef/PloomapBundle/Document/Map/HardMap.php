<?php

namespace Geonef\PloomapBundle\Document\Map;

use Geonef\PloomapBundle\Document\Map as AbstractMap;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Hardcoded map definition for testing purpose only.
 *
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class HardMap extends AbstractMap
{
  public function doBuild(ContainerInterface $container)
  {
  }
}
