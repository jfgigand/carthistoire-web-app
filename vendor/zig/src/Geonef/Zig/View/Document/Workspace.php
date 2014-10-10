<?php

namespace Geonef\Zig\View\Document;

#use \Geonef\Zig\View\Document\XHtml;

class Workspace extends Html
{
  /**
   * @RegistryMapValue(key="widgets")
   */
  public $workspaceWidgets;

  /**
   * @RegistryMapValue(key="settings")
   */
  public $workspaceSettings;

  public function buildScripts()
  {
    $this->writeScriptAffectation('workspaceData',
                                  array('widgets' => $this->workspaceWidgets,
                                        'settings' => $this->workspaceSettings));
    return parent::buildScripts();
  }

  /**
   * @RegistryMapSetter(key="widgets")
   */
  /*public function setWorkspaceWidgets($widgets)
  {
    $this->workspaceWidgets
    }*/

  /**
   * @RegistryMapSetter(key="settings")
   */
  /*public function setWorkspaceSettings($settings)
  {
  }*/
}
