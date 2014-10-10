<?php

namespace Geonef\Ploomap\View\SvgMapLegend;

use Geonef\Zig\Registry\Mapper;
use Geonef\Zig\Util\Number;

/**
 * Legend for proportional circles (Stock & StockRatio)
 *
 */
class Circle extends Base
{
  /**
   * @RegistryMapValue
   */
  public $thresholds = array();

  /**
   * @RegistryMapValue
   */
  public $sizeMultiplier;

  /**
   * @RegistryMapValue
   */
  public $symbolFillColor;

  /**
   * @RegistryMapValue
   */
  public $symbolOutlineColor;

  /**
   * @RegistryMapValue
   */
  public $symbolOutlineWidth;

  /**
   * Set classes and other properties for intervals
   *
   * @RegistryMapSetter(key='circle')
   */
  public function setCircle(array $circle)
  {
    Mapper::mapObject($circle, $this);
  }

  protected function buildContent()
  {
    $resolution = 22598.738500 / 4;
    //$resolution = 0.5;
    $xOffset = 5;
    $lineLen = 3;
    $lineMargin = 1;
    $bottomMargin = 30;
    $style = 'stroke:'.$this->symbolOutlineColor.';stroke-width:'
      .($this->symbolOutlineWidth / $resolution).';';

    if (!count($this->thresholds)) {

      return $this->wrapText("(erreur : aucune borne)");
    }
    $thresholds = $this->thresholds;
    sort($thresholds);
    $dmax = sqrt(end($thresholds) * $this->sizeMultiplier / pi()) / $resolution;
    $els = array();
    //$els[] = $this->wrapText("nb=".count($thresholds)." dmax=".$dmax." mult=".$this->sizeMultiplier." end=".end($thresholds));
    $els[] = $this->tag('circle',
                        array('cx' => $xOffset + $dmax / 2,
                              'cy' => $this->yOffset + $dmax / 2,
                              'r' => $dmax / 2,
                              'style' => $style.'fill:'.$this->symbolFillColor.';'));
    reset($thresholds);
    array_reverse($thresholds);
    foreach ($thresholds as $threshold) {
      $d = sqrt($threshold * $this->sizeMultiplier / pi()) / $resolution;
      $y = $this->yOffset + $dmax / 2 + ($dmax - $d) / 2;
      $els[] = $this->tag('circle',
                          array('cx' => $xOffset + $dmax / 2,
                                'cy' => $y,
                                'r' => $d / 2,
                                'style' => $style.'fill:none;'));
      $x = $this->yOffset + $dmax + $lineLen;
      $y -= $d / 2;
      $els[] = $this->tag('line',
                          array('x1' => $xOffset + $dmax / 2,
                                'y1' => $y, 'x2' => $x, 'y2' => $y,
                                'style' => $style));
      $number = Number::roundDigits($threshold);
      $els[] = $this->tag('text',
                          array('x' => $x + $lineMargin,
                                'y' => $y + 1), strval($number));
    }
    $this->yOffset += $dmax + $bottomMargin;

    return implode($els);
  }
}
