<?php

namespace Geonef\ZigBundle\DependencyInjection;

use Symfony\Component\Config\Definition\Builder\ArrayNodeDefinition;
use Symfony\Component\Config\Definition\Builder\TreeBuilder;

/**
 * ZigExtension configuration structure.
 *
 */
class Configuration
{
    private $debug;

    public function __construct($debug)
    {
        $this->debug = (Boolean) $debug;
    }

    /**
     * Generates the configuration tree.
     *
     * @param boolean $kernelDebug The kernel.debug DIC parameter
     *
     * @return \Symfony\Component\Config\Definition\ArrayNode The config tree
     */
    public function getConfigTree()
    {
        $treeBuilder = new TreeBuilder();
        $rootNode = $treeBuilder->root('zig');

        $this->addInstallSection($rootNode);
        $this->addApiSection($rootNode);
        //$this->addRegistrySection($rootNode);

        return $treeBuilder->buildTree();
    }

    private function addInstallSection(ArrayNodeDefinition $rootNode)
    {
        $rootNode
            ->children()
                ->arrayNode('install')
                    ->canBeUnset()
                    ->children()
                        ->scalarNode('app_version')->end()
                        ->scalarNode('public_dir')->end()
                        ->arrayNode('public_mappings')
                            ->prototype('array')
                                ->treatNullLike(array())
                                ->children()
                                    ->scalarNode('location')->end()
                                    ->scalarNode('directory')->end()
                                ->end()
                            ->end()
                        ->end()
                        ->arrayNode('shrinksafe')
                            ->children()
                                ->scalarNode('buildscripts_dir')->end()
                                ->scalarNode('release_name')->end()
                                ->scalarNode('release_dir')->end()
                                ->scalarNode('build_version')->end()
                                ->arrayNode('profileData')
                                    ->children()
                                        ->arrayNode('prefixes')
                                            ->prototype('array')
                                                ->treatNullLike(array())
                                                ->children()
                                                    ->scalarNode('ns')->end()
                                                    ->scalarNode('path')->end()
                                                ->end()
                                            ->end()
                                        ->end()
                                        ->arrayNode('layers')
                                            ->prototype('array')
                                                ->treatNullLike(array())
                                                ->children()
                                                    ->scalarNode('name')->end()
                                                    ->scalarNode('copyrightFile')->end()
                                                    ->arrayNode('dependencies')
                                                        ->prototype('array')
                                                            ->beforeNormalization()
                                                                ->ifString()
                                                                ->then(function($v) { return array('module' => $v); })
                                                            ->end()
                                                            ->treatNullLike(array())
                                                            ->children()
                                                                ->scalarNode('module')->end()
                                                            ->end()
                                                        ->end()
                                                    ->end()
                                                ->end()
                                            ->end()
                                        ->end()
                                    ->end()
                                ->end()
                            ->end()
                        ->end()
                    ->end()
                ->end()
            ->end()
        ;
    }

    private function addApiSection(ArrayNodeDefinition $rootNode)
    {
        $rootNode
            ->children()
                ->arrayNode('api')
                    ->canBeUnset()
                    ->children()
                        ->arrayNode('namespaces')->end()
                    ->end()
                ->end()
            ->end()
        ;
    }

}
