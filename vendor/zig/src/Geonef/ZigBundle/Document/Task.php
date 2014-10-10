<?php

namespace Geonef\ZigBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Asynchronous task
 *
 * @Doctrine\ODM\MongoDB\Mapping\Document(collection="tasks")
 * @Doctrine\ODM\MongoDB\Mapping\InheritanceType("SINGLE_COLLECTION")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorField(fieldName="module")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorMap({
 *    "OgrLayer" = "Geonef\PloomapBundle\Document\Task\OgrLayer",
 *    "OgrFeature" = "Geonef\PloomapBundle\Document\Task\OgrFeature"
 *  })
 */
abstract class Task
{
  const STATE_WAITING = 'waiting';
  const STATE_READY = 'ready';
  const STATE_PROCESSING = 'processing';
  const STATE_COMPLETE = 'complete';
  const STATE_FAILED = 'failed';

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * Current task state
   *
   * One of the STATE_* constants
   *
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $state = self::STATE_READY;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\ZigBundle\Document\Task")
   */
  protected $remainingDeps;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\ReferenceOne(
   *    targetDocument="Geonef\ZigBundle\Document\Task")
   */
  protected $satisfiedDeps;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Collection
   */
  protected $fullLog = array();

  protected $container;

  public function getId()
  {
    return $this->uuid;
  }

  public function getState()
  {
    return $this->state;
  }

  public function setState($state)
  {
    $this->state = $state;
  }

  public function __construct(ContainerInterface $container)
  {
    $this->container = $container;
    $this->state = self::STATE_READY;
  }

  public function execute(ContainerInterface $container)
  {
    $this->container = $container;
    try {
      $this->setState(self::STATE_PROCESSING);
      $this->executeTask();
      $this->setState(self::STATE_COMPLETE);
    }
    catch (\Exception $e) {
      $this->log('error', 'fatal', $e->getMessage());
      $this->setState(self::STATE_FAILED);
    }
  }

  abstract protected function executeTask();

  protected function log($level, $name, $message)
  {
    $this->fullLog[] = array('level' => $level, 'name' => $name,
                             'message' => $message);
  }

  public function getLog()
  {
    return $this->fullLog;
  }

  public function dependsOn(Task $task)
  {
    $this->remainingDeps[] = $task;
    $this->checkDeps();
  }

  public function checkDeps()
  {
    // todo
  }

}
