<?php

namespace Geonef\ZigBundle\Api;

use Geonef\Zig\Api\ActionDispatcher;

/**
 * Various operations related to the user
 *
 * @package Zig
 * @subpackage Api
 * @author Okapi
 */
class User extends ActionDispatcher
{
  public function feedbackAction()
  {
    $user = $this->request['user'];
    $body = sprintf("Host: %s\nVersion: %s\nUser: %s\n-----\n%s",
                    $this->request['host'],
                    $this->request['version'],
                    $this->request['user'],
                    $this->request['message']);
    $mailer = $this->container->get('mailer');
    $message = \Swift_Message::newInstance()
      ->setSubject('Cartapatate: feedback')
      ->setFrom('feedback@cartapatate.net', $user)
      ->setTo('okapi@lapatate.org')
      ->setBody($body);
    $mailer->send($message);
    $this->response['sent'] = 'ok';
  }
}
