<?php

namespace Geonef\PloomapBundle\Document\MapLayer;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Special map layer setting the position of inheriting map layers
 *
 * @Doctrine\ODM\MongoDB\Mapping\EmbeddedDocument
 */
class Mark
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  public $isMark = true;

  public function getName()
  {
    return '(mark)';
  }

  public function checkProperties(ContainerInterface $container, &$errors)
  {
    return true;
  }

  public function build(\mapObj $msMap, ContainerInterface $container)
  {
    $msLayer = ms_newLayerObj($msMap);
    $msLayer->set('name', '__mark__');
    $msLayer->set('status', MS_OFF);
    $msLayer->set('type', MS_LAYER_POINT);
    $msLayer->setConnectionType(MS_INLINE);
    return $msLayer;
  }

}
