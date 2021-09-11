//URL跳转

var SOLA_DOMAIN 		= 'https://wwbx.zsxyww.htroy.com/api/';
var SOLA_DOMAIN_ADMIN	= SOLA_DOMAIN + 'admin/'; 

var exportParams =  {
	release_urls : {
		SOLA_LINK : 'https://github.com/unlimitedsola',
		LIUYUE_LINK : 'https://github.com/hangxingliu',
		HTROY_LINK : 'https://github.com/FsHtroy',
		JAY_LINK : 'https://github.com/Jayjjjjj',
		RESULT : '../result.html',
		
		SOLA_CHECK_TOKEN	: `${SOLA_DOMAIN}checksession`,
		SOLA_REG			: `${SOLA_DOMAIN}register`,
		SOLA_MODI			: `${SOLA_DOMAIN}profilemodify`,
		SOLA_SUBMIT			: `${SOLA_DOMAIN}ticketsubmit`,
		
		SOLA_TICKET_QUERY	: `${SOLA_DOMAIN}ticketquery`,
		SOLA_TICKET_LOOKUP	: `${SOLA_DOMAIN_ADMIN}ticketlookup`,
		SOLA_TICKET_UPDATE	: `${SOLA_DOMAIN_ADMIN}ticketupdate`,
		SOLA_TICKET_PUSH	: `${SOLA_DOMAIN_ADMIN}ticketpush`,
		
		SOLA_TICKET_TRACK	: `${SOLA_DOMAIN_ADMIN}tickettrack`,
		SOLA_TICKET_LOG		: `${SOLA_DOMAIN_ADMIN}ticketlog`,
		
		SOLA_GET_USER		: `${SOLA_DOMAIN_ADMIN}getuser`,
	}
};

module.exports = exportParams;
