const uploads = []

const form = document.getElementById('form')
const fileInput = document.getElementById('fileInput')
const descriptionInput = document.getElementById('descriptionInput')
const errorMsg = document.getElementById('errorMsg')
const saveBtn = document.getElementById('saveBtn')
const uploadsEl = document.getElementById('uploadsEl')

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
    const ext = file.name.split('.').pop()

    const numberEl = document.createElement('div')
    numberEl.classList.add('item__number')
    numberEl.innerHTML = idx + 1

    const guidEl = document.createElement('div')
    guidEl.classList.add('item__guid')
    guidEl.innerHTML = guid

    const iconEl = document.createElement('div')
    iconEl.classList.add('item__icon')
    iconEl.innerHTML = ext

    const name = document.createElement('div')
    name.classList.add('item__name')
    name.innerHTML = file.name

    const typeEl = document.createElement('div')
    typeEl.classList.add('item__type')
    typeEl.innerHTML = file.type

    const sizeEl = document.createElement('div')
    sizeEl.classList.add('item__size')
    sizeEl.innerHTML = Math.round(file.size / 1024 * 100) / 100 + 'Kb'

    const descriptionEl = document.createElement('div')
    descriptionEl.classList.add('item__description')
    descriptionEl.innerHTML = description

    const itemEl = document.createElement('div')
    itemEl.classList.add('uploads__item')
    itemEl.classList.add('card')

    itemEl.append(numberEl)
    itemEl.append(guidEl)
    itemEl.append(iconEl)
    itemEl.append(name)
    itemEl.append(typeEl)
    itemEl.append(sizeEl)
    itemEl.append(descriptionEl)

    return itemEl
}