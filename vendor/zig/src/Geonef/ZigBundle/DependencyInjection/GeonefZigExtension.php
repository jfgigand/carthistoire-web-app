<?php

namespace Geonef\ZigBundle\DependencyInjection;

use Symfony\Component\HttpKernel\DependencyInjection\Extension;
use Symfony\Component\DependencyInjection\Loader\XmlFileLoader;
use Symfony\Component\DependencyInjection\ContainerBuilder;
use Symfony\Component\Config\Definition\Processor;
use Symfony\Component\Config\FileLocator;

class GeonefZigExtension extends Extension
{

  /**
   * Returns the base path for the XSD files.
   *
   * @return string The XSD base path
   */
  public function getXsdValidationBasePath()
  {
    return __DIR__.'/../Resources/config/';
  }

  /**
   * Returns the namespace to be used for this extension (XML namespace).
   *
   * @return string The XML namespace
   */
  public function getNamespace()
  {
    return 'http://zig.geonef.org/schema';
  }

  /**
   * Returns the recommanded alias to use in XML.
   *
   * This alias is also the mandatory prefix to use when using YAML.
   *
   * @return string The alias
   */
  public function getAlias()
  {
    return 'geonef_zig';
  }

  public function load(array $configs, ContainerBuilder $container)
  {
    $loader = new XmlFileLoader($container, new FileLocator(__DIR__.'/../Resources/config'));

    //$loader->load('install.xml');
    $loader->load('registry.xml');
    $loader->load('api.xml');

    $processor = new Processor();
    $configuration = new Configuration($container->getParameter('kernel.debug'));
    $config = $processor->process($configuration->getConfigTree(), $configs);

    // $config[..] args are passed as references (still fine if !isset)
    $this->registerInstallConfig($config['install'], $container);
    $this->registerRegistryConfig($config['registry'], $container);
    $this->registerApiConfig($config['api'], $container);
  }

  /**
   * @param array $config A configuration array
   * @return ContainerBuilder A ContainerBuilder instance
   */
  protected function registerInstallConfig(&$config, ContainerBuilder $container)
  {
    foreach (array('public_dir', 'public_mappings', 'shrinksafe') as $p) {
      if (isset($config[$p])) {
        $container->setParameter('zig.install.'.$p, $config[$p]);
      }
    }
  }

  /**
   * @param array $config A configuration array
   * @return ContainerBuilder A ContainerBuilder instance
   */
  protected function registerRegistryConfig(&$config, ContainerBuilder $container)
  {
    // not yet written in Configuration
  }

  /**
   * @param array $config A configuration array
   * @return ContainerBuilder A ContainerBuilder instance
   */
  protected function registerApiConfig(&$config, ContainerBuilder $container)
  {
    $container->setparameter
      ('zig.api.namespaces', isset($config['namespaces']) ?
       $config['namespaces'] : $this->findBundleApiNamespaces($container));
  }

  protected function findBundleApiNamespaces($container)
  {
    $namespaces = array();
    foreach ($container->getParameter('kernel.bundles') as $bundle) {
      $name = substr($bundle, strrpos($bundle, '\\') + 1);
      $bundleNS = dirname(strtr($bundle, '\\', '/'));
      $ns = strtr($bundleNS . '/Api', '/', '\\');
      $namespaces[$name] = $ns;
    }
    return $namespaces;
  }

}
