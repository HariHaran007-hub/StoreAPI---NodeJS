const product = require('../models/product') 

const getAllProductsStatic = async(req, res)=>{
    const search = 'ab'
    // const products = await product.find({name: {$regex: search, $options: 'i'}})//i-> case insensitive

    //Sorting
    // const products = await product.find({}).sort('-name price') 

    //Select
    // const products = await product.find({}).select('name price') 

    //Limit
    // const products = await product.find({}).select('name price').limit(5)

    const products = await product.find({ price : {$lt: 30 , $lt: 60}}).select('name price').limit(5)


    res.status(200).json({numberOfHits: products.length, products})
}


const getAllProducts = async(req, res)=>{
    const { company ,featured, name, sort, fields, numericFilters} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false;
    }   
    if(company){
        queryObject.company = company;//Querying th data base object 
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }

    // const products = await product.find(queryObject)   
    let result =  product.find(queryObject)   

    if(sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
        // products = products.sort()
    } else{
        result = result.sort('createdAt')
    }

    if(fields){
        const selectList = fields.split(',').join(' ')
        result = result.select(selectList)
    } 

    //String manipulation   
    if(numericFilters){
        const operatorMap = {
            '>' : '$gt',
            '>=': '$gte',
            '<' : '$lt',
            '<=': '$lte'
        }
        const regEx = /\b(<|>|>=|<=)\b/g
        let filters = numericFilters.replace(regEx, (match)=>`-${operatorMap[match]}-`)
        const options = ['price','rating']
        filters = filters.split(',').forEach((item)=>{
            const [field, operator, value] = item.split('-')
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        })
    }

    result = result.find(queryObject)

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit


    result = result.skip(skip).limit(limit)
    const products = await result
    res.status(200).json({numberOfHits: products.length, products})
}

module.exports = {
    getAllProductsStatic, 
    getAllProducts
}