<?php

namespace Geonef\PloomapBundle\Document\MapLayer;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @EmbeddedDocument
 */
class MapFile
{
  /**
   * @String
   */
  public $content;

  protected function doBuild(\mapObj $msMap, ContainerInterface $container)
  {
    $msLayer = new ms_newLayerObj($msMap);
    $msLayer->updateFromString($content);
    return $msLayer;
  }

}
