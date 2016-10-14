$(document).ready(function()
{
  obtainPlayListId();
});

function obtainPlayListId()
{
  $.getJSON("https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=LaureateChannel&key=AIzaSyBzbZmgnH7eyuHFgpbAcB4vXpSCx9__8qs",
  function(result)
  {
    $("#Container").empty();
    $("#search").val("");

    $.each(result.items, function(i, item)
    {
       var channelId= item.id;
       var playlistId= item.contentDetails.relatedPlaylists.uploads;
       obtainVideos(playlistId);
    });
  });
}

function obtainVideos(playlistId)
{
$.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&playlistId="+playlistId+"&fields=items(snippet(description%2CresourceId%2FvideoId%2Ctitle))%2CnextPageToken%2CprevPageToken&key=AIzaSyBzbZmgnH7eyuHFgpbAcB4vXpSCx9__8qs",
   function(result)
   {
     var nextPage = result.nextPageToken;
     $('#prevPage').attr("disabled", true);
     $('#nextPage').attr("disabled", false);
     $("#nextPage").val(nextPage);

     $.each(result.items, function(i, item)
     {
       var VideoId2 = item.snippet.resourceId.videoId;
       $("#Container").append("<div class='col-sm-6 col-md-4'><div class='row embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src=https://www.youtube.com/embed/"+VideoId2+" allowfullscreen></iframe></div></div>");
     });
   });
}

function obtainPrevOrNextPage(playlistId,tokenNext)
{
  $.getJSON("https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=6&pageToken="+tokenNext+"&playlistId="+playlistId+"&fields=items(snippet(description%2CresourceId%2FvideoId%2Ctitle))%2CnextPageToken%2CprevPageToken&key=AIzaSyBzbZmgnH7eyuHFgpbAcB4vXpSCx9__8qs",
   function(result)
   {
      var nextPage= result.nextPageToken;
      var prevPage= result.prevPageToken;

      setPrevAndNextToken(nextPage,prevPage);

      $("#Container").empty();

     $.each(result.items, function(i, item)
     {
       var VideoId2 = item.snippet.resourceId.videoId;
       $("#Container").append("<div class='col-sm-6 col-md-4'><div class='row embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src=https://www.youtube.com/embed/"+VideoId2+" allowfullscreen></iframe></div></div>");
     });
   });
}

function searchVideos(channelId)
{
  $('#btnSearch').button('loading');
   setTimeout(function ()
   {
      $('#btnSearch').button('reset');
   }, 1000);

   var query = $("#search").val();
   if(query !='')
   {
     $.getJSON("https://www.googleapis.com/youtube/v3/search?part=snippet&channelId="+channelId+"&maxResults=6&q="+query+"&fields=items(id%2FvideoId%2Csnippet(description%2Ctitle))%2CnextPageToken%2CprevPageToken&key=AIzaSyBzbZmgnH7eyuHFgpbAcB4vXpSCx9__8qs",
     function(result)
     {
       var nextPage = result.nextPageToken;
       var prevPage= result.prevPageToken;

       if(result.items.length == '' )
       {
         $("#Container").empty();
         $("#Container").append("<div class='alert alert-danger' role='alert'><center><p>No results found with your search</p></center></div>");
         setPrevAndNextToken(nextPage,prevPage);
       }
       else
       {
         setPrevAndNextToken(nextPage,prevPage);

         $("#Container").empty();

         $.each(result.items, function(i, item)
         {
           var VideoId2 = item.id.videoId;
           $("#Container").append("<div class='col-sm-6 col-md-4'><div class='row embed-responsive embed-responsive-16by9'><iframe class='embed-responsive-item' src=https://www.youtube.com/embed/"+VideoId2+" allowfullscreen></iframe></div></div>");
         });
       }
     });

   }
     else
      showAlertInputEmpty();
    }

    function setPrevAndNextToken(nextPage,prevPage)
    {
      $('#nextPage').attr("disabled", true);
      $('#prevPage').attr("disabled", true);

      if(nextPage != null)
      {
        $("#nextPage").val(nextPage);
        $('#nextPage').attr("disabled", false);
      }

      if (prevPage  !=null)
      {
        $("#prevPage").val(prevPage);
        $('#prevPage').attr("disabled", false);
      }
    }


function showAlertInputEmpty()
{
  swal({
     title: "You must enter something to search in laureate channel!",
     text: "Write something:",
     type: "input",
     showCancelButton: true,
     closeOnConfirm: false,
     animation: "slide-from-top",
     inputPlaceholder: "Write something"
   },
   function(inputValue)
   {
     if (inputValue === false)
       return false;
     if (inputValue === "")
     {
        swal.showInputError("You need to write something!");
        return false
     }
     swal(
       {
        title: "Nice!",
        text: "Search:"+ inputValue,
        timer: 1000,
        showConfirmButton: true
       });

      $("#search").val(inputValue);
      searchVideos("UCvS6-K6Ydmb4gH-kim3AmjA");
   });
}
