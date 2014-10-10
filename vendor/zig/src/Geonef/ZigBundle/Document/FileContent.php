<?php

namespace Geonef\ZigBundle\Document;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class FileContent
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Field
   */
  protected $name;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\File
   */
  protected $file;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Field
   */
  protected $uploadDate;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Field
   */
  protected $length;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Field
   */
  protected $chunkSize;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Field
   */
  protected $md5;

  public function getId()
  {
    return $this->uuid;
  }

  public function getFile()
  {
    return $this->file;
  }

  public function setFile($path)
  {
    $this->file = $path;
  }

  public function getPath($path = null)
  {
    if (is_string($this->file)) {
      return $this->file;
    } elseif (is_object($this->file)) {
      if (!$path) {
        $path = $this->file->getFileName();
      }
      $this->file->write($path);
      return $path;
    } else {
      return null;
    }
  }

  public function getLength()
  {
    return $this->length;
  }

  // public function getBytes()
  // {
  //   //
  // }

}
