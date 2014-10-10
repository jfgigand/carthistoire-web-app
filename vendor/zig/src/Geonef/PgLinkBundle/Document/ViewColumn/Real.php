<?php

namespace Geonef\PgLinkBundle\Document\ViewColumn;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PgLinkBundle\Document\TableColumn;
use Geonef\PgLinkBundle\Document\View;

/**
 * Column link of a view - targetting a real table column
 *
 * @Doctrine\ODM\MongoDB\Mapping\EmbeddedDocument
 */
class Real
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\PgLinkBundle\Document\Table")
   * @Doctrine\ODM\MongoDB\Mapping\Index
   */
  //public $table;

  /**
   * Name of table column
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $name;

  /**
   * User title
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $title;

  /**
   * RO/RW user limitation at view level for this column
   *
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $writeEnabled;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $isNew;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Boolean
   */
  public $isDropped;

  public function __construct(TableColumn $column)
  {
    $this->name = $column->getName();
    $this->writeEnabled = true;
    $this->isNew = true;
  }

  public function getId()
  {
    return $this->uuid;
  }

  /**
   * @return string
   */
  public function getName()
  {
    return $this->name;
  }

  /**
   * @return string
   */
  public function getTitle()
  {
    return $this->title;
  }

  /**
   * @param $title string
   */
  public function setTitle($title)
  {
    $this->title = $title;
  }

  /**
   * @return boolean
   */
  public function isWriteAllowed()
  {
    return $this->writeEnabled;
  }

  /**
   * @param $enabled boolean
   */
  public function setWriteAllowed($enabled)
  {
    $this->writeEnabled = $enabled;
  }

  /**
   * @return string
   */
  public function getType(View $view)
  {
    return $view->getTable()->getColumn($this->name)->getType();
  }

  /**
   * @return string
   */
  public function getSqlValue(ContainerInterface $container, View $view, $value)
  {
    return $view->getTable()->getColumn($this->name)
      ->getSqlValue($container, $value);
  }


}
