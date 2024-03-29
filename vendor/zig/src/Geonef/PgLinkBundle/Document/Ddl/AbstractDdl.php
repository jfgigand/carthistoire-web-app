<?php

namespace Geonef\PgLinkBundle\Document\Ddl;

use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\PgLinkBundle\Document\Table;

/**
 * Physical PG table
 *
 * @Doctrine\ODM\MongoDB\Mapping\MappedSuperClass
 */
abstract class AbstractDdl
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  abstract public function getSql(ContainerInterface $container, Table $table);

  abstract public function finalise(ContainerInterface $container, Table $table);

  //abstract public function recover(ContainerInterface $container, Table $table);

}
