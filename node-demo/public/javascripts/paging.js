
function paging(total, page, pageSize, username){
    // 总页数
    var pageNumber = Math.ceil(total / pageSize);
    var leftList = "";
    var rightList = "";
    var middleList = "";
    var leftNum = 1;
    var rightNum = pageNumber;
    var result;
    if(pageNumber == 1 ) return;

    // 1 ··· 3
    if( page > 5 ){
        // 保留左边三项
        leftNum = page - 3;
        leftList = "<li class='disabled'>" + 
                    "<span>" +
                        "<span aria-hidden='true'>&laquo;</span>" +
                    "</span>" +
                    "</li>" +
                    "<li>" + 
                        "<a href='/u/username=" + username + "?p=1'>1</a>" +
                    "</li>";
        leftList += "<li class='disabled'><a>···</a></li>";
    }

    // 1··· 5 6 7 8 ··· 20
    // 当前page = 5
    if( (page + 5) < pageNumber ){
        // 保留右侧三项 
        rightNum = page + 3;
        rightList = "<li class='disabled><a>···</a></li>";
        rightList += "<li><a href='/u/username=" + username + "?p=" + pageNumber + "' " + ">" + pageNumber + "</a></li>";
    }

    for(var i = leftNum; i <= rightNum; i++ ){
        if(page == i ){
            middleList += "<li><a href='/u/username=" + username + "?p="  + i + "' " + ">" + i + "</a></li>";
        }else{
            middleList += "<li><a href='/u/username=" + username + "?p="  + i + "' " + ">" + i + "</a></li>";
        }
    }

    result = "<li class='disabled'>" + 
                "<span>" +
                    "<span aria-hidden='true'>&laquo;</span>" +
                "</span>" +
            "</li>" + 
            leftList + middleList + rightList + 
            "<li class='disabled'>" + 
                "<span>" +
                    "<span aria-hidden='true'>&raquo</span>" +
                "</span>" +
            "</li>" ;

    result = "<div class='fr'><ul class='pagination'>" + result + "</ul></div>";

    return result;

}


module.exports = paging;