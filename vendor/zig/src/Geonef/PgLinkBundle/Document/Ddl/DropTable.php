<?php

namespace Geonef\PgLinkBundle\Document\Ddl;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PgLinkBundle\Document\Table;

/**
 * Dropping of a PG table. Also remove the Mongo document.
 *
 * @Doctrine\ODM\MongoDB\Mapping\EmbeddedDocument
 */
class DropTable extends AbstractDdl
{

  public function __construct()
  {
  }

  public function getSql(ContainerInterface $container, Table $table)
  {
    $tableName = $table->getSqlName();
    return 'DROP TABLE '.$tableName;
  }

  public function finalise(ContainerInterface $container, Table $table)
  {
    $dm = $container->get('doctrine.odm.mongodb.documentManager');
    $dm->remove($table);
  }

}
