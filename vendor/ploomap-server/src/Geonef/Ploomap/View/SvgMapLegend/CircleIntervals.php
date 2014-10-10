<?php

namespace Geonef\Ploomap\View\SvgMapLegend;

use Geonef\Zig\View\ViewInterface;
use Geonef\Zig\Registry\Mapper;

/**
 * Legend for proportional circles (Stock & StockRatio)
 *
 */
class CircleIntervals implements ViewInterface
{
  const MARGIN = 20;

  const NS = 'http://www.w3.org/2000/svg';

  /**
   * @var array
   * @RegistryMapValue
   */
  public $circle;

  /**
   * @var array
   * @RegistryMapValue
   */
  public $classes;

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


  /* /\** */
  /*  * @RegistryMapSetter(key='circle') */
  /*  *\/ */
  /* public function setCircle(array $circle) */
  /* { */
  /*   $this-> = ; */
  /* } */

  /* /\** */
  /*  * @RegistryMapSetter(key='classes') */
  /*  *\/ */
  /* public function setIntervals(array $intervals) */
  /* { */
  /*   $this->intervalsLegend = Mapper::mapObject($intervals, new Intervals()); */
  /* } */

  public function build()
  {
    $circleLegend = new Circle();
    //var_dump($this->circle);exit;
    Mapper::mapObject($this->circle, $circleLegend);
    $classesLegend = new Intervals();
    Mapper::mapObject($this->classes, $classesLegend);
    $circleSvg = $circleLegend->build();
    $classesLegend->addYOffset($circleLegend->getYOffset() + static::MARGIN);
    $classesSvg = $classesLegend->build();
    /* $circleLegend = Mapper::mapObject($this->circle, new Circle()); */
    /* $classesLegend = Mapper::mapObject($this->classes, new Intervals()); */

    return $this->tag('g', array('xmlns' => self::NS),
                      $circleSvg . $classesSvg);
  }

  /* public function buildLegendContent() */
  /* { */
  /*   $els = array(); */
  /*   var_dump($this->circleLegend); var_dump($this->intervalsLegend); exit; */
  /*   if ($this->circleLegend) { */
  /*     $els[] = $this->circleLegend->build(); */
  /*   } */
  /*   if ($this->intervalsLegend) { */
  /*     $els[] = $this->intervalsLegend->build(); */
  /*   } */
  /*   return implode($els); */
  /* } */

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
