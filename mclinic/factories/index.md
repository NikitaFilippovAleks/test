Создание рассылки

FactoryBot.create(:schedule, name: ‘Прием к окулисту’, active: true, account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d')

создай IntegrationNotification
IntegrationNotification.create(service: 'pact', channel: 'whatsapp', account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', pact_api_key: 'token', pact_company_id: 'id')


Conversation.create(service: 'pact', channel: 'whatsapp', account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', external_id: 1, integration_notification_id: '660a92b8-b6a2-4f91-a3b7-a265e9790ffa', client_id: '6511d210-5e6c-4552-b386-130f7fb1adce')


FactoryBot.create(:conversation, account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', client_id: '70a6cad1-2ff9-4b15-bb18-7b2def24965d')

FactoryBot.create(:conversation_message, conversation_id: 'd0ab06a9-e21f-49a3-a71b-4ceeb439e1f0', account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', client_id: '70a6cad1-2ff9-4b15-bb18-7b2def24965d')

FactoryBot.create(:conversation_message, conversation_id: 'd0ab06a9-e21f-49a3-a71b-4ceeb439e1f0', account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', client_id: '70a6cad1-2ff9-4b15-bb18-7b2def24965d', send_type: 'income')


FactoryBot.create_list(:service_category, 1, account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d')
FactoryBot.create_list(:service, 30, service_category_id: '556b985b-2b2f-47f7-88df-be8e37f36506')


Ларисов Денис

INSERT INTO clients(name,mobile_phone,notifications_allowed,gender,birth_date,registred_at,created_at,updated_at,external_id,account_id) VALUES('Ларисов Денис','876-416-119228',true,'Male','1998-04-01 20:00:00','2016-11-03 21:00:00','2023-08-18 12:51:01.156385','2023-08-18 12:51:01.156385','84975','c01f2868-4499-4a16-aa25-f7642f830a3d');
clientId: fffacc0d-24af-493c-8dd2-b99cd1e07140
doctorId: e68a00ba-f4c4-4bcf-abc5-2f443b5b7083
doctorName: Артём Арсеньевич Щукин

clientName: Муравейчиков Петр
clientId: eedcd639-0c87-43ff-8685-a76240869df0
conversationId: d2a56c55-9a27-4c95-bbfb-40dec2a4cbec


Денисов Генадий
id: 70a6cad1-2ff9-4b15-bb18-7b2def24965d

Федор Петров
id: 4501a8d4-b964-428b-9724-58714b3d009f
scheduleID: 4d59f33b-388d-47e5-830a-eacd07d17230
conversaitoId: d0ab06a9-e21f-49a3-a71b-4ceeb439e1f0

Николай Первов
id: ec53539d-475f-429f-be18-c7eaa8840a77
scheduleId: 4636c7a7-bb47-44a5-9f62-4f2ab34ce05a
messageId: f6a05610-2b61-42ad-b50c-a20639991b02
conversationId: d0ab06a9-e21f-49a3-a71b-4ceeb439e1f0


User admin@example.com

account_id: c01f2868-4499-4a16-aa25-f7642f830a3d

FactoryBot.create(:client, account_id: 'c01f2868-4499-4a16-aa25-f7642f830a3d', name: 'Василий Петрович', mobile_phone: '+7(999)999-99-99')

CLIENT
name: "Василий Петрович",                                                                                                              
 mobile_phone: "+7(999)999-99-99",
 notifications_allowed: true,
 gender: "Female",
 birth_date: Sat, 04 May 1985 00:00:00.000000000 MSD +04:00,
 registred_at: Sat, 19 Mar 2022 00:00:00.000000000 MSK +03:00,
 created_at: Tue, 03 Oct 2023 13:26:54.471628000 MSK +03:00,
 updated_at: Tue, 03 Oct 2023 13:26:54.471628000 MSK +03:00,
 external_id: "16794",
 account_id: "c01f2868-4499-4a16-aa25-f7642f830a3d",
 id: "097b37ae-a17c-4248-aa2f-e8f4a7f0dab1",
 has_whatsapp: nil>

 INTEGRATION_NOTIFICATION
 id: 73989179-d9ac-40b5-a05a-79b83aab85d0

 TEMPLATE
 name: "Запись на классный приём",
 content: "Это запись на классный приём, она очень классная",
 deleted_at: nil,
 created_at: Tue, 03 Oct 2023 13:37:58.967562000 MSK +03:00,
 updated_at: Tue, 03 Oct 2023 13:37:58.967562000 MSK +03:00,
 id: "ca205093-0514-4e1c-bcca-60f68f7dda89",
 account_id: "c01f2868-4499-4a16-aa25-f7642f830a3d">

 CAMPAIGN
 name: "Классная рассылка о записи на прием",
 active: true,
 deleted_at: nil,
 created_at: Tue, 03 Oct 2023 13:44:08.085727000 MSK +03:00,
 updated_at: Tue, 03 Oct 2023 13:44:08.085727000 MSK +03:00,
 id: "5d9a987b-9f09-4b32-b3bd-1844018782cf",
 template_id: "ca205093-0514-4e1c-bcca-60f68f7dda89",
 trigger: "appointment",
 account_id: "c01f2868-4499-4a16-aa25-f7642f830a3d",
 integration_notification_id: "73989179-d9ac-40b5-a05a-79b83aab85d0">

 CONVERSATION_MESSAGE
 id: "95306e12-2df7-46e1-9011-1168646dd277",
 client_id: "097b37ae-a17c-4248-aa2f-e8f4a7f0dab1",
 conversation_id: "bbb5d80d-b282-432d-a469-6f6508b13b1b",
 account_id: "c01f2868-4499-4a16-aa25-f7642f830a3d",
 content: "Очень важное сообщение!",
 external_id: 95451045,
 company_id: 9173515,
 deleted_at: nil,
 created_at: Tue, 03 Oct 2023 13:50:53.132089000 MSK +03:00,
 updated_at: Tue, 03 Oct 2023 13:50:53.132089000 MSK +03:00,
 external_job_id: 6651943,
 send_type: "outcome",
 campaign_trigger: "appointment",
 phone: "948.950.5471",
 status: "sent",
 kind: "campaign",
 campaign_id: "5d9a987b-9f09-4b32-b3bd-1844018782cf",
 template_id: nil,
 notifiable_type: "Schedule",
 notifiable_id: "c90985fb-bc23-4a4a-b089-6658cd1ca722">


41f16f5e-a82b-485a-81d2-ef4b07bb173e

01005ac3-afc4-4615-a9a6-b7f68be1c933
