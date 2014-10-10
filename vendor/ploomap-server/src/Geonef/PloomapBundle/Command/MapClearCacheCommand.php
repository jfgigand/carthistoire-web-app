<?php

namespace Geonef\PloomapBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Geonef\Zig\Util\FileSystem;

class MapClearCacheCommand extends Command
{
  /**
   * Configures the current command.
   */
  protected function configure()
  {
    parent::configure();
    $this
      ->setName('ploomap:map:clear-cache')
      ->addOption('map', null, InputOption::VALUE_OPTIONAL /*InputOption::PARAMETER_OPTIONAL*/, 'Map ID', false)
      ->setHelp(<<<EOT
The <info>ploomap:map:clear-cache</info> command clears the map internal cache
to let the next build occur from its actual properties.
EOT
                );
  }

  protected function execute(InputInterface $input, OutputInterface $output)
  {
    $dm = $this->container->get('doctrine.odm.mongodb.documentManager');
    $repos = $dm->getRepository('Geonef\PloomapBundle\Document\Map');
    $id = $input->getOption('map');
    if ($id) {
      $map = $repos->find($id);
      if (!$map) {
        throw new \Exception('map not found: '.$id);
      }
      $coll = array($map);
    } else {
      $coll = $repos->findAll();
    }
    foreach ($coll as $map) {
      $output->writeln(sprintf("Processing map: <info>%s</info> ...",
                               $map->getId()));
      $map->clearBuild($this->container);
      $dm->persist($map);
    }
    $output->writeln(sprintf("<info>%d</info> map(s) processed. "
                             ."Flushing...", count($coll)));
    $dm->flush();
    $output->writeln(sprintf("Done!."));
  }

}
