ru.json

"education": {
  "courses": {
    "done": {
      "one": "курса пройдено",
      "few": "курсов пройдено",
      "many": "курсов пройдено"
    }
  }
}

en.json

"education": {
  "courses": {
    "done": {
      "one": "course done",
      "few": "courses done",
      "many": "courses done"
    }
  }
}

Courses.tsx

<Text fontSize='2xs' color='#989898'>
  0/2 {
    plural(
      courses.length,
      t('education.courses.done.one'),
      t('education.courses.done.few'),
      t('education.courses.done.many')
    )
  }
</Text>