<?php

namespace Geonef\PloomapBundle\Document\Task;

use Geonef\ZigBundle\Document\Task as AbstractTask;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class OgrFeature extends AbstractTask
{
  protected function executeTask()
  {
  }
}
