const uploads = []

const form = document.getElementById('form')
const fileInput = document.getElementById('fileInput')
const descriptionInput = document.getElementById('descriptionInput')
const errorMsg = document.getElementById('errorMsg')
const saveBtn = document.getElementById('saveBtn')
const uploadsHeaderEl = document.getElementById('uploadsHeaderEl')
const uploadsEl = document.getElementById('uploadsEl')
const editorEl = document.getElementById('editorEl')
const saveDescriptionEl = document.getElementById('saveDescriptionEl')
const closeEditorBtn = document.getElementById('closeEditorBtn')

const ICONS_DICT = {
    jpeg: 'image',
    jpg: 'image',
    png: 'image',
    gif: 'image',
    doc: 'word',
    docx: 'word',
    txt: 'text',
    xls: 'excel',
    xlsx: 'excel',
    exe: 'exe'
}

saveBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const file = fileInput.files[0]
    const description = descriptionInput.value

    if (!(file && description?.length <= 100)) {
        showError()
        return
    }

    hideError()

    uploads.push({ file, description, guid: uuidv4() })
    renderUploadsList()
})

const showError = () => {
    errorMsg.style.display = 'flex'
    form.classList.add('error')
}
const hideError = () => {
    errorMsg.style.display = 'none'
    form.classList.remove('error')
}

const renderUploadsList = () => {
    uploadsEl.innerHTML = ''
    uploads.forEach((u, idx) => uploadsEl.append(createUploadItem(u, idx)))
}

const createUploadItem = (upload, idx) => {
    const { file, description, guid } = upload
    const numberEl = document.createElement('div')
    numberEl.classList.add('item__number')
    numberEl.innerText = idx + 1

    const guidEl = document.createElement('div')
    guidEl.classList.add('item__guid')
    guidEl.innerText = guid
    upload.guid = guid

    const iconEl = document.createElement('div')
    iconEl.classList.add('item__icon')
    const icon = document.createElement('img')
    const type = file.name.split('.').pop()?.toLowerCase()
    const iconSrc = '../img/' + (ICONS_DICT[type] || 'file') + '.png'
    icon.src = iconSrc
    iconEl.append(icon)
    upload.iconSrc = iconSrc

    const nameEl = document.createElement('div')
    nameEl.classList.add('item__name')

    const linkEl = document.createElement('a')
    linkEl.setAttribute('download', file.name)
    linkEl.setAttribute('target', '_blank')
    linkEl.innerText = file.name

    const dataURLReader = new FileReader()
    dataURLReader.addEventListener("load", (e) => {
        const fileURI = e.target.result
        linkEl.setAttribute('href', fileURI)
        upload.fileURI = fileURI
    })
    dataURLReader.readAsDataURL(file)

    nameEl.append(linkEl)
    upload.name = file.name

    const typeEl = document.createElement('div')
    typeEl.classList.add('item__type')
    typeEl.innerText = file.type
    upload.type = file.type

    const sizeEl = document.createElement('div')
    sizeEl.classList.add('item__size')
    const fileSize = file.size.toString().length
    let sizeString = ''
    if (fileSize < 4)
        sizeString = file.size + ' b'
    else if (fileSize < 7)
        sizeString = Math.round(file.size / 1024).toFixed(2) + ' Kb'
    else if (fileSize < 10)
        sizeString = (Math.round(file.size / 1024) / 1000).toFixed(2) + ' MB'
    else if (fileSize < 13)
        sizeString = (Math.round(file.size / 1024 / 1024) / 1000).toFixed(2) + ' GB'
    else
        sizeString = (Math.round(file.size / 1024 / 1024 / 1024) / 1000).toFixed(2) + ' TB'

    sizeEl.innerText = sizeString
    upload.size = sizeString

    const descriptionEl = document.createElement('div')
    descriptionEl.classList.add('item__description')
    descriptionEl.innerText = description

    const hashEl = document.createElement('div')
    hashEl.classList.add('item__hash')

    const arrayBufferReader = new FileReader()
    arrayBufferReader.addEventListener('load', (e) => {
        const arrayBuffer = e.target.result
        const hash = sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(new Uint8Array(arrayBuffer))) + ' - sha256\n' +
            SparkMD5.ArrayBuffer.hash(arrayBuffer) + ' - md5'
        hashEl.innerText = hash
        upload.hash = hash
        console.log(hash)
    })
    arrayBufferReader.readAsArrayBuffer(file)

    const itemEl = document.createElement('div')
    itemEl.classList.add('uploads__item')
    itemEl.classList.add('row')
    itemEl.classList.add('card')
    itemEl.dataset.idx = idx

    itemEl.append(numberEl)
    itemEl.append(guidEl)
    itemEl.append(iconEl)
    itemEl.append(nameEl)
    itemEl.append(typeEl)
    itemEl.append(sizeEl)
    itemEl.append(descriptionEl)
    itemEl.append(hashEl)

    return itemEl
}

let saveDescriptionHandler

uploadsEl.addEventListener('click', (e) => {
    const { target } = e
    if (target.tagName === 'A') {
        return
    }

    uploadsHeaderEl.style.display = 'none'
    const itemEl = target.closest('.uploads__item')
    const { idx } = itemEl.dataset
    const upload = uploads[idx]
    const { guid, name, type, iconSrc, size, description, hash, fileURI } = upload
    uploadsEl.innerHTML = ''

    editorEl.style.display = 'flex'
    editorEl.querySelector('#number > p').innerText = idx
    editorEl.querySelector('#guid > p').innerText = guid
    editorEl.querySelector('#icon > img').src = iconSrc
    editorEl.querySelector('#type > p').innerText = type
    editorEl.querySelector('#size > p').innerText = size
    editorEl.querySelector('#hash > p').innerText = hash

    const linkEl = editorEl.querySelector('#name > a')
    linkEl.setAttribute('href', fileURI)
    linkEl.setAttribute('download', name)
    linkEl.setAttribute('target', '_blank')
    linkEl.innerText = name

    const descriptionEditorInput = editorEl.querySelector('#description > textarea')
    descriptionEditorInput.value = description

    saveDescriptionHandler = () => {
        if (descriptionEditorInput.value.length > 100) {
            descriptionEditorInput.style.borderColor = 'red'
            return
        }
        descriptionEditorInput.style.borderColor = null
        upload.description = descriptionEditorInput.value
    }
    saveDescriptionEl.addEventListener('click', saveDescriptionHandler)
})

closeEditorBtn.addEventListener('click', () => {
    uploadsHeaderEl.style.display = null
    editorEl.style.display = null
    saveDescriptionEl.removeEventListener('click', saveDescriptionHandler)
    renderUploadsList()
})
