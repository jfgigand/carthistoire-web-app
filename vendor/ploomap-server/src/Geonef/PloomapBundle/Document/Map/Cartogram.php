<?php

namespace Geonef\PloomapBundle\Document\Map;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Doctrine\ODM\MongoDB\DocumentManager;
use Geonef\Ploomap\Util\Geo;

/**
 * Module for building ratio cartogram maps
 *
 * Actually, cartogram maps are no different from ratio maps.
 * Just specify a cartogram geographic layer for the "polygonOgr" property.
 *
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class Cartogram extends Ratio
{
  const MODULE = 'Cartogram';

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $cartogramLegendText;

  public function getLegendData(ContainerInterface $container)
  {
    $data = parent::getLegendData($container);
    $data['value']['text'] = $this->cartogramLegendText;
    return $data;
  }

}
