<?php

namespace Geonef\Ploomap\View\SvgMapLegend;

use \Geonef\Zig\View\ViewInterface;
use Geonef\Zig\Util\Number;

/**
 * Base classes for views building SVG map legends
 *
 * A child of this class will usually be instanciated through the
 * Registry mapper, based on the structure returned by Map::getlegendData().
 *
 *
 */
abstract class Base implements ViewInterface
{
  const NS = 'http://www.w3.org/2000/svg';

  const WRAP_LENGTH = 25;

  const RECT_WIDTH = 30;
  const RECT_HEIGHT = 20;

  /**
   * Map legend title
   *
   * @var string
   * @RegistryMapValue
   */
  public $title;

  /**
   * Map unit
   *
   * @var string
   * @RegistryMapValue
   */
  public $unit;

  /**
   * Average value of data
   *
   * @var float
   * @RegistryMapValue
   */
  public $average;

  /**
   * Whether the data list has NULL values
   *
   * @var boolean
   * @RegistryMapValue
   */
  public $hasNull;

  /**
   * @RegistryMapValue
   */
  public $polygonNullFillColor;

  /**
   * @RegistryMapValue
   */
  public $text;

  /**
   * Helper: XmlTag
   *
   * @var Object
   * @RegistryMapInstanciate(
   *    class = "Geonef\Zig\View\Helper\XmlTag",
   *    passThis = true
   *  )
   */
  public $tag;

  protected $yOffset = 5;

  public function addYOffset($nb)
  {
    $this->yOffset += $nb;
  }

  public function getYOffset()
  {
    return $this->yOffset;
  }

  public function build()
  {
    return $this->tag('g',  array('xmlns' => self::NS, 'class' => 'legend'),
                      $this->buildLegendContent());
  }

  protected function buildLegendContent()
  {
    return
      $this->buildTitle()
      . $this->buildUnit()
      . $this->buildContent()
      . $this->buildAverage()
      //. $this->buildHasNull()
      . $this->buildText();
  }

  protected function buildTitle()
  {
    return $this->wrapText($this->title, array('class' => 'title'));
  }

  protected function buildUnit()
  {
    return $this->wrapText($this->unit, array('class' => 'unit'));
  }

  abstract protected function buildContent();

  protected function buildAverage()
  {
    return $this->wrapText('Moyenne : '.Number::roundDigits($this->average),
                           array('class' => 'average'));
  }

  protected function buildText()
  {
    return $this->text ? $this->wrapText($this->text,
                                         array('class' => 'text')) : '';
  }

  /**
   * Utility method to wrap text in multiple <text> lines
   *
   * @param $text string        Text to wrap
   * @param $wrap boolean       Whether to wrap it, or keep it in a single <text> node
   */
  protected function wrapText($text, $attrs = array())
  {
    $t = explode('!!!', wordwrap($text, static::WRAP_LENGTH, '!!!', true));
    $els = array();
    foreach ($t as $line) {
      $els[] = $this->tag('text',
                          array_merge(array('x' => 0, 'y' => $this->yOffset), $attrs),
                          $line);
      $this->yOffset += 14;
    }
    $this->yOffset += 6;

    return implode($els);
  }

  /**
   * Forward call to member objects (helper handling)
   *
   * @return mixed
   */
  public function __call($name, $args)
  {
    if (isset($this->$name)) {
      return call_user_func_array(array($this->$name, '__invoke'), $args);
    }
    throw new \Exception('Call to undefined method: ' . $name);
  }

}
