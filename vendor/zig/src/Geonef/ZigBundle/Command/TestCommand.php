<?php

namespace Geonef\ZigBundle\Command;

use Symfony\Bundle\FrameworkBundle\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputOption;
use Geonef\Zig\Util\String;

use Geonef\PloomapBundle\Document\Template\SvgMap;

class TestCommand extends Command
{
  /**
   * Configures the current command.
   */
  protected function configure()
  {
    parent::configure();
    $this
      ->setName('zig:test')
      ->addOption('opt', null, InputOption::VALUE_OPTIONAL, 'Test option.', false)
      ->setHelp(<<<EOT
<info>zig:test</info> is a simple test.
EOT
                );
  }

  protected function execute(InputInterface $input, OutputInterface $output)
  {
    $output->writeln(sprintf('TEST'));
    $s = String::substitute('bonjour ${hehe:haha}, au revoir, {hin} $ {he}', '');
    $output->writeln(sprintf('str: %s', $s));
    return;
    $dm = $this->container->get('doctrine.odm.mongodb.documentManager');
    $r = $dm->getRepository('Geonef\ZigBundle\Document\Template');
    $r2 = $dm->getRepository('Geonef\PloomapBundle\Document\Map');
    $doc = $r->find('4df018fc960c9ba57d000000');
    $doc2 = $r2->find('4d38e917960c9b576e060000');

    $output->writeln(sprintf('TEST: %s', $doc->getName()));
    $output->writeln(sprintf('TEST2: %s', $doc2->getName()));
    var_dump($doc2->svgTemplate);
    //var_dump($doc2->mapCollection);
    /* $doc = $dm->find('Geonef\PgLinkBundle\Document\View', $id); */
    /* $output->writeln(sprintf('Class: %s', get_class($doc))); */
    /* $table =  $doc->getTable(); */
    /* $output->writeln(sprintf('TABLE Class: %s', get_class($table))); */
    /* $table->getSqlName(); */
    //var_dump($doc);
  }


}
