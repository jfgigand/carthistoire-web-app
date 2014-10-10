<?php

namespace Geonef\ZigBundle\Document\Template;

use Geonef\ZigBundle\Document\Template as AbstractTemplate;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Geonef\Zig\Util\String;

/**
 * @Doctrine\ODM\MongoDB\Mapping\Document
 */
class Text extends AbstractTemplate
{
  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $content;

  /**
   * @Doctrine\ODM\MongoDB\Mapping\String
   */
  public $contentType = 'text/plain';

  /**
   * @inheritsDoc
   */
  public function checkProperties(ContainerInterface $container, &$errors)
  {
    $state = parent::checkProperties($container, $errors);
    $state &= $this->checkCond(strlen(trim($this->content)) > 0,
                               'content', array('invalid', "Obligatoire"),
                               $errors);

    return $state;
  }

  /**
   * @inheritsDoc
   */
  protected function doApply(ContainerInterface $container, $document)
  {
    $this->applyContentType = $this->contentType;
    return $this->doApplySubstitutions($container, $document);
  }

  protected function doApplySubstitutions(ContainerInterface $container, $document)
  {
    $str = String::substitute($this->content, $document);

    return $str;
  }

}
