<?php

namespace Geonef\PgLinkBundle\Document\Ddl;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PgLinkBundle\Document\Table;
use Geonef\PgLinkBundle\Document\TableColumn;

/**
 * Physical PG table
 *
 * @Doctrine\ODM\MongoDB\Mapping\EmbeddedDocument
 */
class AddColumn extends AbstractDdl
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\EmbedOne(
   *    targetDocument="Geonef\PgLinkBundle\Document\TableColumn")
   */
  public $column;

  public function __construct(TableColumn $column)
  {
    $this->column = $column;
  }

  public function getSql(ContainerInterface $container, Table $table)
  {
    return 'ALTER TABLE '.$table->getSqlName().' ADD COLUMN '
      .$this->column->getSqlDescription();
  }

  public function finalise(ContainerInterface $container, Table $table)
  {
    $table->columns->add($this->column);
  }

  public function recover(ContainerInterface $container, Table $table)
  {
    $db = $container->get('zig_pglink.database');
    if ($db->columnExists($table->getSqlName(), $this->column->getName())) {
      $this->finalise($container, $table);
    } // else: just forget about the field
    $table->dirtyDdl->removeElement($this);
  }

}
