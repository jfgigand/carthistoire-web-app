<?php

namespace Geonef\PloomapBundle\Document;

/**
 * @Document(collection="tests")
 */
class Test
{
  /**
   * @String
   */
  public $field1 = 'def';

  /**
   * @Float
   */
  public $field2 = 42.42;

  /**
   * @Hash
   */
  public $sub;

}
