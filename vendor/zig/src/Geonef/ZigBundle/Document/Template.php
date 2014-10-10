<?php

namespace Geonef\ZigBundle\Document;

use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 * @Doctrine\ODM\MongoDB\Mapping\HasLifecycleCallbacks
 * @Doctrine\ODM\MongoDB\Mapping\InheritanceType("SINGLE_COLLECTION")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorField(fieldName="module")
 * @Doctrine\ODM\MongoDB\Mapping\DiscriminatorMap({
 *      "SvgMap" = "Geonef\PloomapBundle\Document\Template\SvgMap",
 *      "Text"   = "Geonef\ZigBundle\Document\Template\Text"
 *  })
 */
abstract class Template
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\Id
   */
  public $uuid;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $name;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Hash
   */
  public $propValidity = array();

  /**
   * @Doctrine\ODM\MongoDB\Mapping\Date
   */
  public $lastEditedAt;

  /**
   * Set by apply(), or getContentType() must be overloaded
   */
  protected $applyContentType;

  /**
   * Set by apply(), or getContent() must be overloaded
   */
  protected $applyContent;

  public function __construct()
  {
    $this->lastEditedAt = new \DateTime();
  }

  public function getId()
  {
    return $this->uuid;
  }

  public function getName()
  {
    return $this->name;
  }

  //
  // PROPERTY VALIDITY
  //

  public function getPropValidity(ContainerInterface $container)
  {
    if (!isset($this->propValidity['valid'])) {
      $this->updatePropValidity($container);
    }
    return $this->propValidity;
  }

  public function updatePropValidity(ContainerInterface $container)
  {
    $errors = array();
    $isValid = $this->checkProperties($container, $errors);
    $this->propValidity = array('valid' => $isValid, 'errors' => $errors);
    return $isValid;
  }

  /**
   * Check validity of the properties
   *
   * @param $container ContainerInterface
   * @param $errors    array
   * @return boolean    Whether the properties are valid
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    $state = true;
    $state &= $this->checkCond(strlen(trim($this->name)) > 0,
                               'name', array('invalid', "Obligatoire"),
                               $errors);

    return $state;
  }

  /**
   * Facility for checkProperties()
   *
   * @param $cond boolean
   * @param $prop string
   * @param $msg string
   * @param $errors array
   */
  protected function checkCond($cond, $prop, $msg, &$errors)
  {
    if (!$cond) {
      $errors[$prop] = $msg;
      return false;
    }
    return true;
  }

  //
  //
  //

  public function getSupportedClasses()
  {
    return array();
  }

  /**
   * Apply
   *
   * @param $document object Document object to apply the template to
   * @return integer Size of result, in bytes
   */
  public function applyTo(ContainerInterface $container, $document)
  {
    $errors = array();
    if (!$this->getPropValidity($container)) {
      throw new \Exception('cannot apply template: invalid properties');
    }
    $this->applyContent = $this->doApply($container, $document);

    return $this->applyContent;
  }

  public function getContentType()
  {
    return $this->applyContentType;
  }

  public function getContent()
  {
    return $this->applyContent;
  }

  abstract protected function doApply(ContainerInterface $container, $document);

}
