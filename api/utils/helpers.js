const errorCatch = (res) => {
    (err) => {
      console.log(err);
      res.status(500).json({ error: err });
    };
}

const requestGet = (url, id, desc) => {
    if(arguments.length > 2) {
        return {
            type: 'GET',
            description: desc,
            url: url + id
        }
    }
    return {
        type: 'GET',
        url: url + id
    }
}

const requestPost = () => descriptionAddBody;

module.exports = { 
    errorCatch,
    requestGet,
    requestPost
};