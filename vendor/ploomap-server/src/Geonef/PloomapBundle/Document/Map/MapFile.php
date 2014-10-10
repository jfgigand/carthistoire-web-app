<?php

namespace Geonef\PloomapBundle\Document\Map;

use Geonef\PloomapBundle\Document\Map as AbstractMap;
use Geonef\Zig\Util\FileSystem;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Simple map builder to simply use a static MAP file
 *
 * @Doctrine\ODM\MongoDB\Mapping\Document(collection="maps")
 */
class MapFile extends AbstractMap
{
  /**
   * Path of MAP file
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $path;

  /**
   * MapFile content
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $content;

  protected function doBuild(ContainerInterface $container)
  {
    $path = $this->getAbsolutePath($container);
    if (!file_exists($path)) {
      throw new \Exception('MAP file does not exist: '.$path);
    }
    //die('load path: '.$path);
    return ms_newMapobj($path);
  }

  public function getAbsolutePath(ContainerInterface $container)
  {
    return 0 === strpos('/', $this->path) ? $this->path :
      FileSystem::makePath($container->getParameter('kernel.root_dir'),
                           $this->path);
  }

}
