$(document).ready(function () {

    $(".details-button").click(function () {

        var details = $(this).siblings(".car-details");

        details.slideToggle(300);

    });


    $("#continue-button").click(function () {

        var selectedCars =
            $("input[name='selectedCars']:checked");

        if (selectedCars.length === 0) {
            alert("يرجى اختيار سيارة واحدة على الأقل قبل متابعة الحجز.");
            return;
        }

        $("#booking-form-container").slideDown(300);

    });


    $("#booking-form").submit(function (event) {

        event.preventDefault();


        var fullName = $("#full-name").val().trim();
        var nationalId = $("#national-id").val().trim();
        var startDate = $("#start-date").val();
        var endDate = $("#end-date").val();
        var mobile = $("#mobile").val().trim();
        var email = $("#email").val().trim();


        var arabicNamePattern =
            /^[\u0621-\u063A\u0641-\u064A\u064B-\u065F\u0670\u06D6-\u06ED]+(?:\s+[\u0621-\u063A\u0641-\u064A\u064B-\u065F\u0670\u06D6-\u06ED]+)+$/;

        if (fullName !== "" &&
            !arabicNamePattern.test(fullName)) {

            alert(
                "يرجى إدخال الاسم الكامل باللغة العربية، مع كتابة اسمين على الأقل."
            );

            $("#full-name").focus();
            return;
        }


        var nationalIdPattern = /^[0-9]{11}$/;

        if (!nationalIdPattern.test(nationalId)) {

            alert("يجب أن يتكون الرقم الوطني من 11 رقمًا.");

            $("#national-id").focus();
            return;
        }


        var governorateCode =
            parseInt(nationalId.substring(0, 2), 10);

        if (governorateCode < 1 || governorateCode > 14) {

            alert(
                "يجب أن يكون أول رقميْن من الرقم الوطني بين 01 و14."
            );

            $("#national-id").focus();
            return;
        }


        if (startDate === "") {

            alert("يرجى تحديد تاريخ بداية الإيجار.");

            $("#start-date").focus();
            return;
        }


        if (endDate === "") {

            alert("يرجى تحديد تاريخ نهاية الإيجار.");

            $("#end-date").focus();
            return;
        }


        function dateToMilliseconds(dateString) {

            var parts = dateString.split("-");

            return Date.UTC(
                Number(parts[0]),
                Number(parts[1]) - 1,
                Number(parts[2])
            );

        }


        var startTime = dateToMilliseconds(startDate);
        var endTime = dateToMilliseconds(endDate);


        if (endTime <= startTime) {

            alert(
                "يجب أن يكون تاريخ نهاية الإيجار بعد تاريخ البداية."
            );

            $("#end-date").focus();
            return;
        }


        var mobilePattern = /^09[345689][0-9]{7}$/;

        if (mobile !== "" &&
            !mobilePattern.test(mobile)) {

            alert(
                "يرجى إدخال رقم موبايل سوري صحيح، مثل رقم يبدأ بـ 093 أو 094."
            );

            $("#mobile").focus();
            return;
        }

        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email !== "" &&
            !emailPattern.test(email)) {

            alert("يرجى إدخال بريد إلكتروني صحيح.");

            $("#email").focus();
            return;
        }

        var days = Math.round(
            (endTime - startTime) / 86400000
        );

        var selectedCars =
            $("input[name='selectedCars']:checked");


        if (selectedCars.length === 0) {

            alert("يرجى اختيار سيارة واحدة على الأقل.");

            return;
        }

var subtotal = 0;
var resultRows = "";

selectedCars.each(function () {

    var row = $(this).closest("tr");

    var code = row.find("td").eq(1).text().trim();

    var model = row.find("td").eq(2).text().trim();

    var priceText = row.find("td").eq(4).text().trim();

    var price = parseFloat(
        priceText.replace(/,/g, "")
    );

    if (isNaN(price) || price < 0) {

        alert("تعذر قراءة سعر السيارة: " + code);

        resultRows = "";
        subtotal = NaN;

        return false;
    }

    var carTotal = price * days;

    subtotal += carTotal;

    resultRows +=
        "<tr>" +
            "<td>" + code + "</td>" +
            "<td>" + model + "</td>" +
            "<td>" + price.toLocaleString("en-US") +
                " ليرة سورية</td>" +
            "<td>" + days + "</td>" +
            "<td>" + carTotal.toLocaleString("en-US") +
                " ليرة سورية</td>" +
        "</tr>";

});


if (isNaN(subtotal)) {
    return;
}


var discount = 0;

if (days > 10) {
    discount = subtotal * 0.05;
}


var finalTotal = subtotal - discount;


var discountMessage = "";

if (discount > 0) {

    discountMessage =
        "<p><strong>الخصم (5%): </strong>" +
        discount.toLocaleString("en-US") +
        " ليرة سورية</p>";

} else {

    discountMessage =
        "<p><strong>الخصم: </strong>لا يوجد</p>";

}

var resultHTML =

    "<h2>ملخص الحجز</h2>" +

    "<p><strong>تاريخ البداية: </strong>" +
    startDate +
    "</p>" +

    "<p><strong>تاريخ النهاية: </strong>" +
    endDate +
    "</p>" +

    "<p><strong>مدة الإيجار: </strong>" +
    days +
    " يومًا</p>" +

    "<table>" +

        "<thead>" +
            "<tr>" +
                "<th>رمز السيارة</th>" +
                "<th>الطراز</th>" +
                "<th>السعر اليومي</th>" +
                "<th>عدد الأيام</th>" +
                "<th>تكلفة السيارة</th>" +
            "</tr>" +
        "</thead>" +

        "<tbody>" +
            resultRows +
        "</tbody>" +

    "</table>" +

    "<p><strong>المجموع قبل الخصم: </strong>" +
    subtotal.toLocaleString("en-US") +
    " ليرة سورية</p>" +

    discountMessage +

    "<h3>المجموع النهائي: " +
    finalTotal.toLocaleString("en-US") +
    " ليرة سورية</h3>";


    $("#booking-result")
    .html(resultHTML)
    .slideDown(300);

    });
});
