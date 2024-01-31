// const incomingUri = '/home/1/rooms/5';
// const currentUri = '/home/:homeId/rooms/:roomId';

// const incomingUriParts = incomingUri.split('/')
// const currentUriParts = currentUri.split('/')

// const currentUriParamIndexes = []

// // parts.length eşit mi?
// if (incomingUriParts.length == currentUriParts.length) {
//     // currentUri ':' ile başlıyorsa indexini al
//     for (let i = 0; i<currentUriParts.length; i++) {
//         if(currentUriParts[i].startsWith(':')) {
//             currentUriParamIndexes.push(i)
//         }
//     }

//     // incomingUri parametrelerini al
//     // currentUri parametresini al
//     // birleştirip obje yarat
//     if (currentUriParamIndexes.length > 0) {
//         const obj = {}
//         currentUriParamIndexes.forEach(index => {
//             obj[currentUriParts[index].slice(1)] = incomingUriParts[index] 
//         })

//         console.log(obj)
//     }
// }
