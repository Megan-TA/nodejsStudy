
function paging(total, page, pageSize, username){
    // 总页数
    var pageNumber = Math.ceil(total / pageSize);
    var leftList = "";
    var rightList = "";
    var middleList = "";
    var leftNum = 1;
    var rightNum = pageNumber;
    var result;
    var baseUrl = "/u/username=" + username + "?p="; 
    var lastPage;
    var nextPage;
    var result1;
    var result2;


    if(pageNumber == 1 ) return;

    // 1 ··· 3
    if( page > 5 ){
        // 保留左边三项
        leftNum = page - 3;
        leftList =  "<li>" + 
                        "<a href='" + baseUrl + "1'>1</a>" +
                    "</li>";
        leftList += "<li class='disabled'><a>···</a></li>";
    }

    // 1··· 5 6 7 8 ··· 20
    // 当前page = 5
    if( (page + 5) < pageNumber ){
        // 保留右侧三项 
        rightNum = page + 3;
        rightList = "<li class='disabled'><span>···</span></li>";
        rightList += "<li><a href='" + baseUrl + pageNumber + "' " + ">" + pageNumber + "</a></li>";
    }

    for(var i = leftNum; i <= rightNum; i++ ){
        if(page == i ){
            middleList += "<li class='active'><a href='" + baseUrl + i + "' " + ">" + i + "</a></li>";
        }else{
            middleList += "<li><a href='" + baseUrl  + i + "' " + ">" + i + "</a></li>";
        }
    }

    // 最左侧和最后侧极限情况
    if( (page - 1) >= 1) {
        lastPage = page - 1;
        result1 = "<li>" + 
                    "<a href='" + baseUrl + lastPage  + "'>" +
                    "&laquo;</a>" +
                  "</li>";
    }else{
        lastPage = 1;
        result1 = "<li class='disabled'>" +
                    "<span>&laquo;</span>" +
                  "</li>";
    }
    if( (page + 1) <= pageNumber) {
        nextPage = page + 1;
        result2 = "<li>" +
                    "<a href='" + baseUrl + nextPage  + "'>" +
                    "&raquo</a>" +
                 "</li>";
    }else{
        nextPage = pageNumber;
        result2 = "<li class='disabled'>" + 
                    "<span>&raquo</span>" +
                  "</li>";
    }


    result = result1 + leftList + middleList + rightList + result2;

    result = "<div class='fr'><ul class='pagination'>" + result + "</ul></div>";



    return result;

}


module.exports = paging;