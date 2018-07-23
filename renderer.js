let memoTitle = document.getElementById('memo-title');
let memoText = document.getElementById('memo-text');
let usedMemoId = '';
const path = require('path');
let memoDate = document.getElementById('memo-date');
let btnSave = document.getElementById('btn-save');
let btnDelete = document.getElementById('btn-delete');
let btnNew = document.getElementById('btn-new');
const notifier = require('node-notifier');
const ENTER_KEY = 13;
const uuidv1 = require('uuid/v1');
const storage = require('electron-json-storage');
// console.log(storage.getDataPath());
function todayDate() {
    let datetoday = new Date().toDateString();
    let dateslicetoday = datetoday.slice(4);
    let dateModifiertoday = dateslicetoday.split(' ').join('.');
    memoDate.innerText = dateModifiertoday;
}
todayDate();

function addMemo(text, title) {
    if (usedMemoId == '') {
        if (text && title != '') {
            let _id = uuidv1();
            let todo = {
                _id,
                title: title,
                content: text,
                date: new Date().toDateString()
            }

            storage.set(_id, todo, (err) => {
                if (err) throw err;
                showMemo();
                notifier.notify({
                    title: 'Saved!',
                    message: todo.title + ' has been saved',
                    icon:path.join(__dirname, 'assets/Memoico64.png'),
                    sound: false,
                });

            });

        }else{
            alert('plesae fill both title and content');
        }
    }
}

function showMemo() {
    storage.getAll((err, data) => {
        if (err) console.log(err);
        drawMemosOnList(data);
    })
}

function drawMemosOnList(data) {
    var list = document.getElementById('memo-list');
    list.innerHTML = '';
    Object.keys(data).forEach((key) => {
        list.appendChild(createMemoListItem(data[key]));
    })
}

function createMemoListItem(item) {
    if (item.content) {
        var contentSubeed = item.content.substring(0, 32) + '...';
    } else {
        contentSubeed = '...';
    }
    var liSub = document.createElement('li');
    liSub.className = 'nav-item  memo-des';
    liSub.appendChild(document.createTextNode(contentSubeed));
    var ul = document.createElement('ul');
    ul.className = 'nav flex-column mt-2';
    ul.appendChild(liSub);
    var li = document.createElement('li');
    li.appendChild(document.createTextNode(item.title));
    li.className = 'list-group-item item-mem ml-2';
    li.id = 'li_' + item._id;
    li.appendChild(ul);
    return li;
}
btnSave.addEventListener('click', () => {
    if (usedMemoId == '') {
        addMemo(memoText.value, memoTitle.value);
    } else if (usedMemoId != '') {
        updateMemo(usedMemoId);
    }
    showMemo();
});
document.addEventListener('click', function (e) {
    e = e || window.event;
    if (e.target.id.indexOf('li') >= 0) {
        openmemo(e.target.id);
    }
}, false);

function openmemo(target) {
    let id = target.replace('li_', '');
    console.log(id);
    storage.get(id, (err, data) => {
        if (err) throw err;
        insertdata(data);
    })
}

function insertdata(data) {
    usedMemoId = '';
    let dateslice = data.date.slice(4);
    let dateModifier = dateslice.split(' ').join('.');
    memoTitle.value = data.title;
    memoText.value = data.content;
    memoDate.innerHTML = dateModifier;
    usedMemoId = data._id;
}
btnDelete.addEventListener('click', () => {
    if (usedMemoId == '') {
        alert('cannot be removed pls select a memo')
    } else if (usedMemoId != '') {
        deleteMemo(usedMemoId);
    }
    showMemo();
});
btnNew.addEventListener('click', () => {
    memoTitle.value = '';
    memoText.value = '';
    usedMemoId = '';
});

function updateMemo(id) {
    storage.set(id, {
        _id: id,
        title: memoTitle.value,
        content: memoText.value,
        date: new Date().toDateString()
    });
    console.log(memoTitle.value, memoText.value)
}

function deleteMemo(id) {
    storage.remove(id, function (error) {
        if (error) throw error;
    });
    memoTitle.value = '';
    memoText.value = '';
    usedMemoId = '';
}
showMemo();
