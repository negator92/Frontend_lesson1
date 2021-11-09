const uploads = []

const form = document.getElementById('form')
const fileInput = document.getElementById('fileInput')
const descriptionInput = document.getElementById('descriptionInput')
const errorMsg = document.getElementById('errorMsg')
const saveBtn = document.getElementById('saveBtn')
const uploadsEl = document.getElementById('uploadsEl')

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

    if (!(file && description && description?.length < 100)) {
        showError()
        return
    }

    hideError()

    const guid =
        Math.ceil(Math.random() * 1e8) + '-'
        + [0, 0, 0].map(i => Math.ceil(Math.random() * 1e4)).join('-') + '-'
        + Math.ceil(Math.random() * 1e12)

    uploads.push({ file, description, guid })
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

const createUploadItem = ({ file, description, guid }, idx) => {
    const numberEl = document.createElement('div')
    numberEl.classList.add('item__number')
    numberEl.innerText = idx + 1

    const guidEl = document.createElement('div')
    guidEl.classList.add('item__guid')
    guidEl.innerText = guid

    const iconEl = document.createElement('div')
    iconEl.classList.add('item__icon')
    const icon = document.createElement('img')
    const type = file.name.split('.').pop()?.toLowerCase()
    icon.src = '../img/' + (ICONS_DICT[type] || 'file') + '.png'
    iconEl.append(icon)

    const name = document.createElement('div')
    name.classList.add('item__name')
    name.innerText = file.name

    const typeEl = document.createElement('div')
    typeEl.classList.add('item__type')
    typeEl.innerText = file.type

    const sizeEl = document.createElement('div')
    sizeEl.classList.add('item__size')
    fileSize = file.size.toString().length
    if (fileSize < 4)
        sizeEl.innerText = file.size + ' b';
    else if (fileSize < 7)
        sizeEl.innerText = Math.round(file.size / 1024).toFixed(2) + ' Kb';
    else if (fileSize < 10)
        sizeEl.innerText = (Math.round(file.size / 1024) / 1000).toFixed(2) + ' MB';
    else if (fileSize < 13)
        sizeEl.innerText = (Math.round(file.size / 1024 / 1024) / 1000).toFixed(2) + ' GB';
    else
        sizeEl.innerText = (Math.round(file.size / 1024 / 1024 / 1024) / 1000).toFixed(2) + ' TB';

    const descriptionEl = document.createElement('div')
    descriptionEl.classList.add('item__description')
    descriptionEl.innerText = description

    const itemEl = document.createElement('div')
    itemEl.classList.add('uploads__item')
    itemEl.classList.add('card')

    const descriptionEditEl = document.createElement('div')
    descriptionEditEl.classList.add('item__description-editor')

    const input = document.createElement('input')
    input.placeholder = 'Введите описание'
    descriptionEditEl.append(input)

    const btn = document.createElement('button')
    btn.innerText = 'Сохранить'

    input.addEventListener('input', () => {
        if (input.value.length > 100) {
            input.classList.add('error')
            btn.disabled = true
            return
        }

        input.classList.remove('error')
        btn.disabled = false
    })

    btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const upload = uploads[idx]
        upload.description = input.value || upload.description
        descriptionEl.innerText = upload.description
        itemEl.classList.remove('uploads__item--edited')
    })

    descriptionEditEl.append(btn)

    itemEl.append(numberEl)
    itemEl.append(guidEl)
    itemEl.append(iconEl)
    itemEl.append(name)
    itemEl.append(typeEl)
    itemEl.append(sizeEl)
    itemEl.append(descriptionEl)
    itemEl.append(descriptionEditEl)

    return itemEl
}

uploadsEl.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.uploads__item')

    if (itemEl.classList.contains('uploads__item--edited')) {
        return
    }

    itemEl.classList.add('uploads__item--edited')

    const descriptionEl = itemEl.querySelector('.item__description')
    const description = descriptionEl.innerText
    const descriptionEditEl = itemEl.querySelector('.item__description-editor')
    const input = descriptionEditEl.querySelector('input')
    input.value = description
})
