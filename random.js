function generateTransactionReference() {
    let reference = '';
    for (let i = 0; i < 30; i++) {
        reference += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return reference;
}

console.log(generateTransactionReference());