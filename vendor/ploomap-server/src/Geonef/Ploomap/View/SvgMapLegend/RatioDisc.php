<?php

namespace Geonef\Ploomap\View\SvgMapLegend;

use Geonef\Zig\View\ViewInterface;
use Geonef\Zig\Registry\Mapper;

/**
 * Legend for intervals + discontinuities (RatioDisc)
 *
 */
class RatioDisc implements ViewInterface
{
  const NS = 'http://www.w3.org/2000/svg';
  const WRAP_LENGTH = 25;
  const MARGIN = 20;

  /**
   * @RegistryMapValue
   */
  public $minWidth;

    /**
   * @RegistryMapValue
   */
  public $maxWidth;

    /**
   * @RegistryMapValue
   */
  public $nullWidth;

    /**
   * @RegistryMapValue
   */
  public $color;

  /**
   * @RegistryMapValue
   */
  public $nullColor;

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

  protected $yOffset = 5;

  /**
   * Set disc properties
   *
   * @RegistryMapSetter(key='disc')
   */
  public function setDisc(array $disc)
  {
    Mapper::mapObject($disc, $this);
  }

  public function build()
  {
    $classesLegend = new Intervals();
    Mapper::mapObject($this->classes, $classesLegend);
    $classesSvg = $classesLegend->build();
    $this->yOffset += $classesLegend->getYOffset() + static::MARGIN;

    return $this->tag('g', array('xmlns' => self::NS, 'class' => 'legend'),
                      $classesSvg . $this->buildDiscontinuities());
  }

  protected function buildDiscontinuities()
  {
    $width = 50;//8 // longueur des traits
    $space = 3; // marge horizontale entre les traits
    $bottomMargin = 40;
    $epFact = 1;
    $xOffset = 0;

    $min = $this->minWidth;
    $max = $this->maxWidth;
    $et = intval(round($max - $min));
    $list = array($min, intval(round($min + $et / 4)),
		   intval(round($min + $et / 2)), $max);
    $els = array();
    $els[] = $this->wrapText('Discontinuité relative');
    for ($i = 0, $count = count($list); $i < $count; $i++) {
      if ($i == 0)
	$txt = 'faible';
      elseif ($i == $count - 1)
	$txt = 'forte';
      else
	unset($txt);
      $epaisseur = floatval($list[$i]) * $epFact;
      $y = $this->yOffset + 0;
      $x = $xOffset + ($width + $space) * $i;
      $els[] = $this->tag('line',
                          array('x1' => $x, 'y1' => $y,
                                'x2' => $x + $width, 'y2' => $y,
                                'style' => 'stroke:'.$this->color
                                .';stroke-width:'.$epaisseur));
      if (isset($txt)) {
        $els[] = $this->tag('text',
                            array('x' => $x + $width / 2,
                                  'y' => $this->yOffset + 20,
                                  //'style' => 'text-align:center;',
                                  'class' => 'epaisseur'),
                            $txt);
      }
      /* echo '<line x1="'.$x.'" y1="'.$y.'" x2="'.($x+$width).'" y2="'.$y */
      /*   .'" style="stroke:'.$couleur.';stroke-width:'.$epaisseur.'"/>'; */
      /* echo '<text x="'.($x + $width / 2).'" y="'.(self::$yOffset + 1) */
      /*   .'" class="epaisseur">'.$txt.'</text>'; */
    }
    $this->yOffset += $epaisseur + $bottomMargin;

    return implode($els);
  }

  /**
   * Utility method to wrap text in multiple <text> lines
   *
   * @param $text string        Text to wrap
   * @param $wrap boolean       Whether to wrap it, or keep it in a single <text> node
   */
  protected function wrapText($text, $wrap = true)
  {
    if ($wrap) {
      $t = explode('!!!', wordwrap($text, static::WRAP_LENGTH, '!!!', true));
    } else {
      $t = array($txt);
    }
    $els = array();
    foreach ($t as $line) {
      $els[] = $this->tag('text', array('x' => 0, 'y' => $this->yOffset), $line);
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
