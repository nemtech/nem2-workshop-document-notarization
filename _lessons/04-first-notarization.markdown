---
layout: post
title:  "Your first notarization"
permalink: /lessons/first-notarization/
---

Alice has a document on her computer. She wants to prove the document existed on a specific date and that she has access to it. This document could be any digital file with an interest to be notarized.  For example, a meaningful contract, a movie script or a patent.

In this first exercise, you will be saving the whole content of the file inside the blockchain. Normally, it is not a good idea to store large amounts of data in the blockchain. This first approach will allow us to upgrade the solution in the following exercises.

## Background

NEM is [account](https://nemtech.github.io/concepts/account.html) based and  [transaction](https://nemtech.github.io/concepts/transaction.html) driven. An account allows:

* To hold assets.
* To be uniquely identified.
* To alter the status of the blockchain, by announcing transactions with [assets](https://nemtech.github.io/concepts/mosaic.html) and messages to other accounts.

An account consist of three main components:

* **Private key**: A string that holds all the power of the account.
* **Public key**: The public key is derived from the private key and identifies your account in the network. It is secure to share your public key with anyone.
* **Address**:  The address is then derived from your public key. You will normally share the derived address instead, as it is shorter and gathers more information.

![diagram-notarization]({{ site.baseurl }}/assets/images/diagram-notarization.png)

## Instructions

First, we need to create accounts:

* A: Alice's account.
* B: A wallet Alice uses to store her notarizations.

Then, A will send a transaction to B, adding the content of the file to be notarized as a message.

The transaction, if valid, will be [included in a block](https://nemtech.github.io/concepts/block.html). When new blocks are added on top, you can assume the transaction will persist in the blockchain.

Performing actions in the blockchain have a cost. This is necessary to provide an incentive for those who validate and secure the network. The fee is paid in cat.currency, the underlying cryptocurrency of the NEM network.

    ℹ️In your private network, you can send transaction without paying fees.

Instead of creating a new account, let’s use an account which already has cat.currency.

1\. Open a terminal and go to the directory where you have downloaded Catapult Bootstrap Service.
{% highlight bash %}

$> cd  build/generated-addresses/
$> cat addresses.yaml
{% endhighlight %}

2\. Under the section nemesis_addresses, you will find the key pairs which contain cat.currency.

3\. Load the first account as a profile in NEM2-CLI. This account identifies Alice.

{% highlight bash %}
$> nem2-cli profile create
Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): MIJIN_TEST
Introduce NEM 2 Node URL. (Example: http://localhost:3000): http://localhost:3000
Insert profile name (blank means default and it could overwrite the previous profile): alice
New Account:    SBFSSN-MF5DOC-Q7S62D-ALYPXT-6KZM44-RT367B-VWSE
Public Key:     3F2842ABC234D068B06625D01224D9E62D9767C79E4DF7BB5F562869DC6539FD
Private Key:    6D...80
{% endhighlight %}

4\. Create a new profile for Alice's notarizations. 

{% highlight bash %}
$> nem2-cli account generate
Introduce network type (MIJIN_TEST, MIJIN, MAIN_NET, TEST_NET): MIJIN_TEST
Do you want to save it? [y/n]: y
Introduce NEM 2 Node URL. (Example: http://localhost:3000): http://localhost:3000
Insert profile name (blank means default and it could overwrite the previous profile): alice_notarizations_wallet
New Account:    SC5ZOIOYKHKEIJOXEFJQK5KRRE5KNZFDZTZA43BI
Public Key:     EBEC67B604C1C549674B4B021228A0DE8975A29071E496FCCE4446DEBA15F20B
Private Key:    41...F6
{% endhighlight %}


5\. Fetch the account's information anytime by running:

{% highlight bash %}
$> nem2-cli profile list
{% endhighlight %}

6\. Create a new .txt file, and write "Hello World" inside. NEM messages length is limited to ``1024`` characters.

    ℹ️You could split the content into several transfer transactions, but it is preferable not to store a large amount of data in the blockchain. In the next exercise, you will see how to solve this issue.

7\. Open the [Notarization dashboard](http://localhost:4200/) in your browser. You should see the following screen:

![screenshot-notarization-panel]({{ site.baseurl }}/assets/images/screenshot-notarization-panel.png)

Have you tried to do a notarization using the panel? It is still not working. You will have to code the NEM integration.

8\. Review `notarize()` function under ``project/src/app/components/createNotarization.component.ts``. 

You will see the notarization transaction is created, then signed by an account and finally announced to the network.

{% highlight typescript %}
  notarize(form) {
    const account = Account.createFromPrivateKey(form.privateKey, NetworkType.MIJIN_TEST);
    const recipient = Address.createFromRawAddress(form.address);
    const message = PlainMessage.create(form.message);

    const notarization = this.notarizationService.createNotarizationTransaction(recipient, message);
    const signedNotarization = account.sign(notarization!);

    [..]
    
    this.transactionHttp
      .announce(signedNotarization)
      .subscribe(announcedTransaction => console.log(announcedTransaction),
       err => console.log(err);
  }
{% endhighlight %}


Once an account announces a transaction, the server will always return an OK response. 

Transactions get the ``unconfirmed status`` status as soon they reach the network. It is only when a transaction is included in one block that it receives the confirmation.

Receiving an OK response does not mean the transaction is valid. A good practice is to monitor transactions status before being announced.
 
{% highlight typescript %}
    this.listener.open().then(() => {

      this.listener
        .status(account.address)
        .pipe(
          filter((transaction) => transaction.hash === signedNotarization.hash)
        )
        .subscribe(errorStatus => {
          this.progress = {'message': errorStatus.status, 'code': 'ERROR'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});

      this.listener
        .confirmed(account.address)
        .pipe(
          filter((transaction) =>
            transaction.transactionInfo !== undefined
            && transaction.transactionInfo.hash === signedNotarization.hash)
        )
        .subscribe(ignored => {
          this.progress = {'message': 'Notarization confirmed with hash ' + signedNotarization.hash, 'code': 'CONFIRMED'};
        }, err => this.progress = {'message': err, 'code': 'ERROR'});
        
        [...]
    });
  }
    
{% endhighlight %}

9\. Open ``project/src/app/services/notarization.service.ts`` and create a transfer transaction under ``createNotarizationTransaction``function. A transaction requires:

* **Deadline**: How many blocks can pass before the transaction has to be included in a block.
* **Recipient**: The account's address where Alice will send the notarization.
* **Message**: The content of the file as a message. 
* **Network**: In this exercise we are using MIJIN_TESTNET.

{% highlight typescript %}
  createNotarizationTransaction(recipient: Address, message: PlainMessage) : TransferTransaction{

    return TransferTransaction.create(
      Deadline.create(),
      recipient,
      [],
      message,
      NetworkType.MIJIN_TEST
    );
  }
{% endhighlight %}


10\. Save your changes and go back to the notarization panel. Drag and drop your .txt file, paste Alice's notarization wallet address (B) and Alice's private key (A) to sign the transaction. Then, click ``Notarize`` to announce the notarization to the network.

![screenshot-public-notarization]({{ site.baseurl }}/assets/images/screenshot-public-notarization.png)

11\. Wait until the status message states **"Transaction confirmed"**. Then, copy the transaction hash in a new text file. 

![screenshot-notarization-confirmed]({{ site.baseurl }}/assets/images/screenshot-notarization-confirmed.png)
