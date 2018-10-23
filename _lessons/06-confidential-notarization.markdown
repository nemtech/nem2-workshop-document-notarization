---
layout: post
title:  "Confidential notarization"
permalink: /lessons/confidential-notarization/
---

In the previous module, the timestamped document's content was be visible by anyone who had read access to the blockchain. Also, there was a limitation of characters, so we could not notarize large documents.

Now, Alice wants to notarize a **confidential document**. That means she wants to keep the content of the document private for herself. However, she must be  able to prove that it existed and she is the owner.

## Background

A **hash function** is used to map data of arbitrary size to data of a fixed size. This function only works one way, meaning no one will be able to recover the original content. For example, applying the sha256 hashing algorithm to any file will transform it to a 256-bit-length string.

    ℹ️ It is not possible to recover the original content. But, simple words and short sentences always generate the same 256-bit hash.

![confidential-notarization]({{ site.baseurl }}/assets/images/diagram-confidential-notarization.png)

In this exercise, you are going to apply a hash function to the content of the file. Then, we will send a transaction with the fixed length hash. This enables the possibility to timestamp large files using one single transaction.

## Solution

1\. Open `project/src/app/components/createNotarization.component.ts`, and edit ``onFileChange()`` function. This function is called after dragging the file into the notarization panel. Apply the hash function to the content of the file using SHA256 algorithm.

{% highlight typescript %}
  onFileChange(){
    this.notarizationService
      .readFile(this.file)
      .subscribe( message =>{
        this.notarizationForm.patchValue({'message': crypto.SHA256(message).toString(crypto.enc.Hex) });
        this.notarizationForm.get('message')!.markAsDirty();
      })
  }
{% endhighlight %}

2\. Save the file. Then, notarize the document using the panel.

* **File**: test.txt
* **Notarization address**: Alice's notarization wallet address.
* **Signer private key**:  Alice's account private key.

![screenshot-private-notarization]({{ site.baseurl }}/assets/images/screenshot-private-notarization.png)

3\. Go to ``Get Notarization`` tab, and search the transaction once confirmed. 

![screenshot-get-private-notarization]({{ site.baseurl }}/assets/images/screenshot-get-private-notarization.png)

Every time you apply the hash function to the file, the output hash should coincide with the one stored in the transaction message.