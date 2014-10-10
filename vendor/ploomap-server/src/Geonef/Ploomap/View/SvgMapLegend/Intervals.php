<?php

namespace Geonef\Ploomap\View\SvgMapLegend;

use Geonef\Zig\Registry\Mapper;
use Geonef\Zig\Util\Number;

/**
 * Legend for intervals (Ratio, etc)
 *
 */
class Intervals extends Base
{
  /**
   * @RegistryMapValue
   */
  public $intervals;

  /**
   * @RegistryMapValue
   */
  public $maximum;

  /**
   * @RegistryMapValue
   */
  public $polygonOutlineColor;

  /**
   * Set classes and other properties for intervals
   *
   * @RegistryMapSetter(key='classes')
   */
  public function setClasses(array $classes)
  {
    Mapper::mapObject($classes, $this);
  }

  protected function buildContent()
  {
    return $this->builIntervals() . $this->buildHasNull();;
  }

  protected function builIntervals()
  {
    if (!is_array($this->intervals)) {
      throw new \Exception('intervals not defined (not an array) for ratio classes');
    }
    $els = array();
    $xOffset = 0;
    $hMargin = 6;
    $vMargin = 6;
    $minOffset = 0;
    $maxOffset = 0;
    $topMargin = 10;
    $bottomMargin = 0; // 5
    $this->yOffset += $topMargin;
    foreach ($this->intervals as $class) {
      $style = 'stroke-width:0.1;stroke:'.$this->polygonOutlineColor
        .';fill:'.$class['color'].';';
      $els[] = $this->tag('rect', array('x' => $xOffset,
                                        'y' => $this->yOffset,
                                        'width' => static::RECT_WIDTH,
                                        'height' => static::RECT_HEIGHT,
                                        'style' => $style));
      if (isset($class['minimum'])) {
        $els[] = $this->tag('text', array('x' => $xOffset + static::RECT_WIDTH +
                                          $hMargin,
                                          'y' => $this->yOffset + $minOffset),
                            Number::roundDigits($class['minimum']));
      }
      $this->yOffset += static::RECT_HEIGHT + $vMargin;
    }
    if ($this->maximum) {
      $els[] = $this->tag('text', array('x' => $xOffset + static::RECT_WIDTH +
                                        $hMargin,
                                        'y' => $this->yOffset + $maxOffset),
                          Number::roundDigits($this->maximum));
    }
    $this->yOffset += static::RECT_HEIGHT + /*$vMargin +*/ $bottomMargin;

    return implode($els);
  }

  protected function buildHasNull()
  {
    $hMargin = 6;
    if (!$this->hasNull) {

      return;
    }
    $els = array();
    $style = 'stroke-width:0.1;stroke:'.$this->polygonOutlineColor
      .';fill:'.$this->polygonNullFillColor.';';
    $els[] = $this->tag('rect', array('x' => 0,
                                      'y' => $this->yOffset,
                                      'width' => static::RECT_WIDTH,
                                      'height' => static::RECT_HEIGHT,
                                      'style' => $style));
    $els[] = $this->tag('text', array('x' => static::RECT_WIDTH + $hMargin,
                                      'y' => $this->yOffset + 18), 'Absence de données');
    $this->yOffset += static::RECT_HEIGHT + 30;

    return implode($els);;
  }

}
