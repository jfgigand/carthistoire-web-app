<?php

namespace Geonef\PloomapBundle\Document\OgrDataSource;

use Geonef\PloomapBundle\Document\OgrDataSource as BaseClass;
use Geonef\Zig\Util\FileSystem;
use Geonef\Zig\Util\Dev;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class File extends BaseClass
{
  /**
   * Datasource file or directory
   *
   * Exemple: directory of shapefiles
   *
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\ZigBundle\Document\File")
   */
  public $file;

  public function setFile($file)
  {
    $this->file = $file;
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
    $state = $this->checkCond($this->file,
                          'file', 'missing', $errors) &&
      $this->checkCond($this->file->getId(),
                       'file', 'invalid', $errors);
    if ($state) {
      $state &= parent::checkProperties($container, $errors);
    }
    return $state;
  }

  public function getSourcePath(ContainerInterface $container)
  {
    $file = Dev::getRealDocument
      ($this->file, $container->get('doctrine.odm.mongodb.documentManager'));
    $file->setContainer($container);
    return $file->getPath();
  }

  public function getModuleName()
  {
    return 'File';
  }

}
